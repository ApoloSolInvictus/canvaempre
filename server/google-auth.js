import { createSign } from 'node:crypto';

const tokenEndpoint = 'https://oauth2.googleapis.com/token';
const tokenScope = [
  'https://www.googleapis.com/auth/datastore',
  'https://www.googleapis.com/auth/cloud-platform',
].join(' ');

let cachedAccessToken = null;
let cachedAccessTokenExpiresAt = 0;

const base64Url = (value) =>
  Buffer.from(value)
    .toString('base64')
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');

const readServiceAccount = () => {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replaceAll(
    '\\n',
    '\n',
  );

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Firebase Admin no está configurado en el servidor.');
  }

  return { projectId, clientEmail, privateKey };
};

const createServiceAccountAssertion = ({ clientEmail, privateKey }) => {
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64Url(
    JSON.stringify({
      iss: clientEmail,
      scope: tokenScope,
      aud: tokenEndpoint,
      iat: now,
      exp: now + 3600,
    }),
  );
  const unsignedToken = `${header}.${payload}`;
  const signer = createSign('RSA-SHA256');
  signer.update(unsignedToken);
  signer.end();
  const signature = signer
    .sign(privateKey, 'base64')
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');

  return `${unsignedToken}.${signature}`;
};

export const getFirebaseAdminConfig = () => readServiceAccount();

export const getGoogleAccessToken = async () => {
  if (
    cachedAccessToken &&
    Date.now() < cachedAccessTokenExpiresAt - 60_000
  ) {
    return cachedAccessToken;
  }

  const serviceAccount = readServiceAccount();
  const assertion = createServiceAccountAssertion(serviceAccount);
  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`No se pudo autenticar Firebase Admin: ${detail}`);
  }

  const data = await response.json();
  cachedAccessToken = data.access_token;
  cachedAccessTokenExpiresAt = Date.now() + data.expires_in * 1000;

  return cachedAccessToken;
};
