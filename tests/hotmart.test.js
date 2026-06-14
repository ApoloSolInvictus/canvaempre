import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync } from 'node:crypto';
import {
  ACTIVE_EVENTS,
  REVOKED_EVENTS,
  isExpectedProduct,
  parseHotmartPayload,
  validateHotmartToken,
} from '../server/hotmart.js';
import webhookHandler from '../api/hotmart-webhook.js';

const approvedPayload = {
  id: 'event-123',
  creation_date: 1_781_400_000_000,
  event: 'PURCHASE_APPROVED',
  version: '2.0.0',
  data: {
    product: {
      id: 106307027,
      name: 'Canva Emprende',
    },
    buyer: {
      email: 'ALUMNO@EJEMPLO.COM ',
      name: 'Alumno Ejemplo',
    },
    purchase: {
      transaction: 'HP123456789',
      offer: {
        code: 'offer-code',
      },
    },
  },
};

test('normaliza un evento aprobado de Hotmart 2.0', () => {
  const event = parseHotmartPayload(approvedPayload);

  assert.equal(event.event, 'PURCHASE_APPROVED');
  assert.equal(event.email, 'alumno@ejemplo.com');
  assert.equal(event.transaction, 'HP123456789');
  assert.equal(event.productId, '106307027');
  assert.equal(event.offerCode, 'offer-code');
  assert.equal(ACTIVE_EVENTS.has(event.event), true);
});

test('admite los estados legados que revocan acceso', () => {
  const expectedEvents = new Map([
    ['refunded', 'PURCHASE_REFUNDED'],
    ['chargeback', 'PURCHASE_CHARGEBACK'],
    ['canceled', 'PURCHASE_CANCELED'],
    ['expired', 'PURCHASE_EXPIRED'],
  ]);

  for (const [status, expectedEvent] of expectedEvents) {
    const event = parseHotmartPayload({
      status,
      email: 'alumno@ejemplo.com',
      transaction: `legacy-${status}`,
    });

    assert.equal(event.event, expectedEvent);
    assert.equal(REVOKED_EVENTS.has(event.event), true);
  }
});

test('valida el Hottok por encabezado o cuerpo', () => {
  process.env.HOTMART_HOTTOK = 'secret-token';

  assert.equal(
    validateHotmartToken(
      { headers: { 'x-hotmart-hottok': 'secret-token' } },
      {},
    ),
    true,
  );
  assert.equal(
    validateHotmartToken({ headers: {} }, { hottok: 'secret-token' }),
    true,
  );
  assert.equal(
    validateHotmartToken(
      { headers: { 'x-hotmart-hottok': 'wrong-token' } },
      {},
    ),
    false,
  );
});

test('puede restringir producto y oferta mediante variables privadas', () => {
  process.env.HOTMART_PRODUCT_ID = '106307027';
  process.env.HOTMART_OFFER_CODE = 'offer-code';

  assert.equal(
    isExpectedProduct({
      productId: '106307027',
      offerCode: 'offer-code',
    }),
    true,
  );
  assert.equal(
    isExpectedProduct({
      productId: '999',
      offerCode: 'offer-code',
    }),
    false,
  );

  delete process.env.HOTMART_PRODUCT_ID;
  delete process.env.HOTMART_OFFER_CODE;
  delete process.env.HOTMART_HOTTOK;
});

test('el endpoint informa su estado sin revelar secretos', async () => {
  const request = { method: 'GET', headers: {} };
  let statusCode = 0;
  let body = null;
  const response = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(value) {
      body = value;
      return this;
    },
  };

  await webhookHandler(request, response);

  assert.equal(statusCode, 200);
  assert.equal(body.ok, true);
  assert.equal(body.service, 'hotmart-webhook');
  assert.equal(typeof body.configured, 'boolean');
  assert.equal('hottok' in body, false);
});

test('una compra aprobada crea el derecho de acceso y responde 200', async () => {
  const { privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
  });
  process.env.HOTMART_HOTTOK = 'webhook-secret';
  process.env.FIREBASE_ADMIN_PROJECT_ID = 'demo-project';
  process.env.FIREBASE_ADMIN_CLIENT_EMAIL =
    'firebase-adminsdk@demo-project.iam.gserviceaccount.com';
  process.env.FIREBASE_ADMIN_PRIVATE_KEY = privateKey.export({
    type: 'pkcs8',
    format: 'pem',
  });
  process.env.HOTMART_PRODUCT_ID = '106307027';
  process.env.HOTMART_OFFER_CODE = 'offer-code';

  const originalFetch = global.fetch;
  const requests = [];
  global.fetch = async (url, options = {}) => {
    const method = options.method ?? 'GET';
    requests.push({ url: String(url), method });

    if (String(url).includes('oauth2.googleapis.com/token')) {
      return new Response(
        JSON.stringify({ access_token: 'google-token', expires_in: 3600 }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    }

    if (method === 'GET') {
      return new Response('', { status: 404 });
    }

    if (String(url).endsWith('/documents:runQuery')) {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ name: 'saved' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  };

  let statusCode = 0;
  let body = null;
  const response = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(value) {
      body = value;
      return this;
    },
  };

  try {
    await webhookHandler(
      {
        method: 'POST',
        headers: { 'x-hotmart-hottok': 'webhook-secret' },
        body: approvedPayload,
      },
      response,
    );
  } finally {
    global.fetch = originalFetch;
    delete process.env.HOTMART_HOTTOK;
    delete process.env.FIREBASE_ADMIN_PROJECT_ID;
    delete process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    delete process.env.FIREBASE_ADMIN_PRIVATE_KEY;
    delete process.env.HOTMART_PRODUCT_ID;
    delete process.env.HOTMART_OFFER_CODE;
  }

  assert.equal(statusCode, 200);
  assert.equal(body.ok, true);
  assert.equal(body.accessStatus, 'active', JSON.stringify(body));
  assert.equal(body.matchedUsers, 0);
  assert.equal(
    requests.some(({ url }) => url.includes('/hotmartEntitlements?')),
    true,
  );
  assert.equal(
    requests.some(({ url }) => url.includes('/hotmartWebhookEvents?')),
    true,
  );
});

test('un evento repetido responde 200 sin volver a escribir acceso', async () => {
  const { privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
  });
  process.env.HOTMART_HOTTOK = 'webhook-secret';
  process.env.FIREBASE_ADMIN_PROJECT_ID = 'demo-project';
  process.env.FIREBASE_ADMIN_CLIENT_EMAIL =
    'firebase-adminsdk@demo-project.iam.gserviceaccount.com';
  process.env.FIREBASE_ADMIN_PRIVATE_KEY = privateKey.export({
    type: 'pkcs8',
    format: 'pem',
  });
  process.env.HOTMART_PRODUCT_ID = '106307027';
  process.env.HOTMART_OFFER_CODE = 'offer-code';

  const originalFetch = global.fetch;
  const firestoreWrites = [];
  global.fetch = async (url, options = {}) => {
    const requestUrl = String(url);
    const method = options.method ?? 'GET';

    if (requestUrl.includes('oauth2.googleapis.com/token')) {
      return new Response(
        JSON.stringify({ access_token: 'google-token', expires_in: 3600 }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    }

    if (method !== 'GET') {
      firestoreWrites.push({ requestUrl, method });
    }

    return new Response(
      JSON.stringify({
        name:
          'projects/demo-project/databases/(default)/documents/' +
          'hotmartWebhookEvents/existing',
        fields: {
          event: { stringValue: 'PURCHASE_APPROVED' },
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  };

  let statusCode = 0;
  let body = null;
  const response = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(value) {
      body = value;
      return this;
    },
  };

  try {
    await webhookHandler(
      {
        method: 'POST',
        headers: { 'x-hotmart-hottok': 'webhook-secret' },
        body: approvedPayload,
      },
      response,
    );
  } finally {
    global.fetch = originalFetch;
    delete process.env.HOTMART_HOTTOK;
    delete process.env.FIREBASE_ADMIN_PROJECT_ID;
    delete process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    delete process.env.FIREBASE_ADMIN_PRIVATE_KEY;
    delete process.env.HOTMART_PRODUCT_ID;
    delete process.env.HOTMART_OFFER_CODE;
  }

  assert.equal(statusCode, 200);
  assert.equal(body.ok, true);
  assert.equal(body.duplicate, true);
  assert.deepEqual(firestoreWrites, []);
});
