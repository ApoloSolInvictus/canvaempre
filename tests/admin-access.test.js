import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync } from 'node:crypto';
import {
  ensureAdminProfile,
  isAdminEmail,
} from '../server/admin-access.js';

test('reconoce el administrador principal y correos configurados', () => {
  process.env.ADMIN_EMAILS = 'socio@example.com, equipo@example.com';

  assert.equal(isAdminEmail('RONNYWOODS77@GMAIL.COM '), true);
  assert.equal(isAdminEmail('socio@example.com'), true);
  assert.equal(isAdminEmail('alumno@example.com'), false);

  delete process.env.ADMIN_EMAILS;
});

test('recrea un perfil administrativo activo sin compra', async () => {
  const { privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
  });
  process.env.FIREBASE_ADMIN_PROJECT_ID = 'demo-project';
  process.env.FIREBASE_ADMIN_CLIENT_EMAIL =
    'firebase-adminsdk@demo-project.iam.gserviceaccount.com';
  process.env.FIREBASE_ADMIN_PRIVATE_KEY = privateKey.export({
    type: 'pkcs8',
    format: 'pem',
  });

  const originalFetch = global.fetch;
  let savedProfile = null;

  global.fetch = async (url, options = {}) => {
    const requestUrl = String(url);
    const method = options.method ?? 'GET';

    if (requestUrl.includes('oauth2.googleapis.com/token')) {
      return new Response(
        JSON.stringify({ access_token: 'google-token', expires_in: 3600 }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    }

    if (method === 'GET') {
      return new Response('', { status: 404 });
    }

    if (
      method === 'POST' &&
      requestUrl.includes('/documents/users?documentId=admin-uid')
    ) {
      savedProfile = JSON.parse(options.body);
      return new Response(JSON.stringify({ name: 'saved-admin' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response('Unexpected request', { status: 500 });
  };

  try {
    const result = await ensureAdminProfile({
      sub: 'admin-uid',
      email: 'ronnywoods77@gmail.com',
      email_verified: true,
      name: 'Ronny Woods',
    });

    assert.equal(result.user.data.accessStatus, 'active');
    assert.equal(result.user.data.role, 'admin');
    assert.equal(result.user.data.paymentProvider, 'admin');
    assert.equal(
      savedProfile.fields.accessStatus.stringValue,
      'active',
    );
    assert.equal(savedProfile.fields.role.stringValue, 'admin');
  } finally {
    global.fetch = originalFetch;
    delete process.env.FIREBASE_ADMIN_PROJECT_ID;
    delete process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    delete process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  }
});

test('rechaza el privilegio si el correo no esta verificado', async () => {
  const result = await ensureAdminProfile({
    sub: 'admin-uid',
    email: 'ronnywoods77@gmail.com',
    email_verified: false,
  });

  assert.equal(result, null);
});
