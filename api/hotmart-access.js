import {
  getDocument,
  setDocument,
  updateDocument,
} from '../server/firestore-rest.js';
import { verifyFirebaseIdToken } from '../server/firebase-token.js';
import { hashValue, normalizeEmail } from '../server/hotmart.js';

const json = (response, status, body) => {
  response.status(status).json(body);
};

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return json(response, 405, { ok: false, error: 'Método no permitido.' });
  }

  try {
    const authorization = request.headers.authorization ?? '';
    const token = authorization.startsWith('Bearer ')
      ? authorization.slice(7)
      : '';

    if (!token) {
      return json(response, 401, { ok: false, error: 'Falta autenticación.' });
    }

    const claims = await verifyFirebaseIdToken(token);
    const email = normalizeEmail(claims.email ?? '');
    if (!email || claims.email_verified !== true) {
      return json(response, 403, {
        ok: false,
        error: 'El perfil necesita un correo verificado.',
      });
    }

    const entitlement = await getDocument(
      `hotmartEntitlements/${hashValue(email)}`,
    );

    if (!entitlement) {
      return json(response, 200, {
        ok: true,
        accessStatus: 'pending_payment',
        matched: false,
      });
    }

    const userPath = `users/${claims.sub}`;
    const currentUser = await getDocument(userPath);
    const accessData = {
      accessStatus: entitlement.data.accessStatus,
      paymentProvider: 'hotmart',
      paymentTransaction:
        entitlement.data.paymentTransaction ?? '',
      hotmartEvent: entitlement.data.hotmartEvent ?? '',
      paidAt: entitlement.data.paidAt ?? null,
      refundedAt: entitlement.data.revokedAt ?? null,
      updatedAt: new Date(),
    };

    if (currentUser) {
      await updateDocument(userPath, accessData);
    } else {
      await setDocument(userPath, {
        uid: claims.sub,
        name: claims.name ?? email.split('@')[0],
        email,
        currentLevel: 0,
        totalProgress: 0,
        completedLessons: [],
        favoriteCourses: [],
        createdAt: new Date(),
        ...accessData,
      });
    }

    return json(response, 200, {
      ok: true,
      accessStatus: entitlement.data.accessStatus,
      matched: true,
    });
  } catch (error) {
    console.error('Hotmart access sync error', error);
    return json(response, 401, {
      ok: false,
      error: 'No se pudo verificar el acceso.',
    });
  }
}
