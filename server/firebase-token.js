import { createPublicKey, verify } from 'node:crypto';
import { getFirebaseAdminConfig } from './google-auth.js';

const certificateUrl =
  'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';

let cachedCertificates = null;
let certificatesExpireAt = 0;

const decodeBase64Url = (value) =>
  Buffer.from(value.replaceAll('-', '+').replaceAll('_', '/'), 'base64');

const loadCertificates = async () => {
  if (cachedCertificates && Date.now() < certificatesExpireAt) {
    return cachedCertificates;
  }

  const response = await fetch(certificateUrl);
  if (!response.ok) {
    throw new Error('No se pudieron cargar los certificados de Firebase.');
  }

  cachedCertificates = await response.json();
  const cacheControl = response.headers.get('cache-control') ?? '';
  const maxAge = Number(cacheControl.match(/max-age=(\d+)/)?.[1] ?? 3600);
  certificatesExpireAt = Date.now() + maxAge * 1000;
  return cachedCertificates;
};

export const verifyFirebaseIdToken = async (token) => {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Token de Firebase inválido.');

  const header = JSON.parse(decodeBase64Url(parts[0]).toString('utf8'));
  const payload = JSON.parse(decodeBase64Url(parts[1]).toString('utf8'));
  const certificates = await loadCertificates();
  const certificate = certificates[header.kid];
  const { projectId } = getFirebaseAdminConfig();
  const now = Math.floor(Date.now() / 1000);

  if (!certificate || header.alg !== 'RS256') {
    throw new Error('Firma de Firebase desconocida.');
  }

  const validSignature = verify(
    'RSA-SHA256',
    Buffer.from(`${parts[0]}.${parts[1]}`),
    createPublicKey(certificate),
    decodeBase64Url(parts[2]),
  );

  if (
    !validSignature ||
    payload.aud !== projectId ||
    payload.iss !== `https://securetoken.google.com/${projectId}` ||
    payload.exp <= now ||
    payload.iat > now ||
    !payload.sub
  ) {
    throw new Error('Token de Firebase expirado o inválido.');
  }

  return payload;
};
