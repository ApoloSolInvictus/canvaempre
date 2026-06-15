import {
  getDocument,
  setDocument,
  updateDocument,
} from './firestore-rest.js';

const PRIMARY_ADMIN_EMAIL = 'ronnywoods77@gmail.com';

const normalizeEmail = (email = '') => email.trim().toLowerCase();

const configuredAdminEmails = () =>
  (process.env.ADMIN_EMAILS ?? '')
    .split(/[\s,;]+/)
    .map(normalizeEmail)
    .filter(Boolean);

export const isAdminEmail = (email) =>
  new Set([
    PRIMARY_ADMIN_EMAIL,
    ...configuredAdminEmails(),
  ]).has(normalizeEmail(email));

export const ensureAdminProfile = async (claims) => {
  const email = normalizeEmail(claims.email ?? '');
  if (!isAdminEmail(email) || claims.email_verified !== true) {
    return null;
  }

  const path = `users/${claims.sub}`;
  const currentUser = await getDocument(path);
  const adminAccess = {
    email,
    accessStatus: 'active',
    role: 'admin',
    accessSource: 'admin_allowlist',
    updatedAt: new Date(),
  };

  if (currentUser) {
    const needsUpdate =
      currentUser.data.email !== email ||
      currentUser.data.accessStatus !== 'active' ||
      currentUser.data.role !== 'admin' ||
      currentUser.data.accessSource !== 'admin_allowlist';

    if (needsUpdate) {
      await updateDocument(path, adminAccess);
    }

    return {
      claims,
      path,
      user: {
        ...currentUser,
        data: {
          ...currentUser.data,
          ...adminAccess,
        },
      },
    };
  }

  const profile = {
    uid: claims.sub,
    name: claims.name ?? email.split('@')[0],
    email,
    currentLevel: 0,
    totalProgress: 0,
    completedLessons: [],
    favoriteCourses: [],
    createdAt: new Date(),
    paymentProvider: 'admin',
    ...adminAccess,
  };

  await setDocument(path, profile);

  return {
    claims,
    path,
    user: {
      id: claims.sub,
      data: profile,
    },
  };
};
