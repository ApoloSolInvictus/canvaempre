import { getDocument } from './firestore-rest.js';
import { ensureAdminProfile } from './admin-access.js';
import { verifyFirebaseIdToken } from './firebase-token.js';

export const getBearerToken = (request) => {
  const authorization = request.headers.authorization ?? '';
  return authorization.startsWith('Bearer ')
    ? authorization.slice(7)
    : '';
};

export const requireActiveUser = async (request) => {
  const token = getBearerToken(request);
  if (!token) {
    const error = new Error('Falta autenticación.');
    error.status = 401;
    throw error;
  }

  const claims = await verifyFirebaseIdToken(token);
  if (!claims.email || claims.email_verified !== true) {
    const error = new Error('El correo debe estar verificado.');
    error.status = 403;
    throw error;
  }

  const adminProfile = await ensureAdminProfile(claims);
  if (adminProfile) {
    return adminProfile;
  }

  const path = `users/${claims.sub}`;
  const user = await getDocument(path);
  if (!user || user.data.accessStatus !== 'active') {
    const error = new Error('El perfil no tiene acceso activo.');
    error.status = 403;
    throw error;
  }

  return { claims, path, user };
};
