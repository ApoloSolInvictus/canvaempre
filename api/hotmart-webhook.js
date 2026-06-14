import {
  findDocumentsByStringField,
  getDocument,
  setDocument,
  updateDocument,
} from '../server/firestore-rest.js';
import {
  ACTIVE_EVENTS,
  REVOKED_EVENTS,
  hashValue,
  isExpectedProduct,
  parseHotmartPayload,
  validateHotmartToken,
} from '../server/hotmart.js';
import {
  alertsConfigured,
  notifyWebhookError,
} from '../server/alerts.js';

const json = (response, status, body) => {
  response.status(status).json(body);
};

const parseBody = (body) => {
  if (typeof body === 'string') return JSON.parse(body);
  return body ?? {};
};

const accessStatusForEvent = (event) => {
  if (ACTIVE_EVENTS.has(event)) return 'active';
  if (REVOKED_EVENTS.has(event)) return 'revoked';
  return null;
};

export default async function handler(request, response) {
  if (request.method === 'GET') {
    return json(response, 200, {
      ok: true,
      service: 'hotmart-webhook',
      configured: Boolean(
        process.env.HOTMART_HOTTOK &&
          process.env.FIREBASE_ADMIN_PROJECT_ID &&
          process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
          process.env.FIREBASE_ADMIN_PRIVATE_KEY,
      ),
      alertsConfigured: alertsConfigured(),
    });
  }

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'GET, POST');
    return json(response, 405, { ok: false, error: 'Método no permitido.' });
  }

  let eventContext = {};

  try {
    const payload = parseBody(request.body);
    if (!validateHotmartToken(request, payload)) {
      return json(response, 401, { ok: false, error: 'Hottok inválido.' });
    }

    const eventData = parseHotmartPayload(payload);
    eventContext = {
      event: eventData.event,
      eventId: eventData.eventId,
      transaction: eventData.transaction,
      productId: eventData.productId,
    };
    if (!isExpectedProduct(eventData)) {
      return json(response, 200, { ok: true, ignored: 'product' });
    }

    const accessStatus = accessStatusForEvent(eventData.event);
    const eventKey = hashValue(eventData.eventId);
    const previousEvent = await getDocument(
      `hotmartWebhookEvents/${eventKey}`,
    );

    if (previousEvent) {
      return json(response, 200, { ok: true, duplicate: true });
    }

    if (!accessStatus) {
      await setDocument(`hotmartWebhookEvents/${eventKey}`, {
        event: eventData.event,
        transaction: eventData.transaction,
        ignored: true,
        receivedAt: new Date(),
      });
      return json(response, 200, { ok: true, ignored: 'event' });
    }

    if (!eventData.email) {
      await notifyWebhookError(
        new Error('El evento no contiene correo del comprador.'),
        eventContext,
      );
      return json(response, 422, {
        ok: false,
        error: 'El evento no contiene correo del comprador.',
      });
    }

    const entitlementKey = hashValue(eventData.email);
    const entitlementPath = `hotmartEntitlements/${entitlementKey}`;
    const currentEntitlement = await getDocument(entitlementPath);

    if (
      currentEntitlement?.data?.eventTimestamp > eventData.eventTimestamp
    ) {
      await setDocument(`hotmartWebhookEvents/${eventKey}`, {
        event: eventData.event,
        transaction: eventData.transaction,
        ignored: true,
        reason: 'older-event',
        receivedAt: new Date(),
      });
      return json(response, 200, { ok: true, ignored: 'older-event' });
    }

    const now = new Date();
    const entitlement = {
      email: eventData.email,
      accessStatus,
      paymentProvider: 'hotmart',
      paymentTransaction: eventData.transaction,
      hotmartEvent: eventData.event,
      hotmartEventId: eventData.eventId,
      eventTimestamp: eventData.eventTimestamp,
      productId: eventData.productId,
      productName: eventData.productName,
      offerCode: eventData.offerCode,
      updatedAt: now,
      paidAt:
        accessStatus === 'active'
          ? currentEntitlement?.data?.paidAt ?? now
          : currentEntitlement?.data?.paidAt ?? null,
      revokedAt: accessStatus === 'revoked' ? now : null,
    };

    if (currentEntitlement) {
      await updateDocument(entitlementPath, entitlement);
    } else {
      await setDocument(entitlementPath, entitlement);
    }

    const users = await findDocumentsByStringField(
      'users',
      'email',
      eventData.email,
    );
    await Promise.all(
      users.map((user) =>
        updateDocument(`users/${user.id}`, {
          accessStatus,
          paymentProvider: 'hotmart',
          paymentTransaction: eventData.transaction,
          hotmartEvent: eventData.event,
          paidAt: entitlement.paidAt,
          refundedAt: entitlement.revokedAt,
          updatedAt: now,
        }),
      ),
    );

    await setDocument(`hotmartWebhookEvents/${eventKey}`, {
      event: eventData.event,
      emailHash: entitlementKey,
      transaction: eventData.transaction,
      accessStatus,
      matchedUsers: users.length,
      receivedAt: now,
    });

    return json(response, 200, {
      ok: true,
      accessStatus,
      matchedUsers: users.length,
    });
  } catch (error) {
    console.error('Hotmart webhook error', error);
    await notifyWebhookError(error, eventContext);
    return json(response, 500, {
      ok: false,
      error: 'No se pudo procesar el evento.',
    });
  }
}
