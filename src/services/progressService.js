import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { courses, totalLessonCount } from '../data/courses';
import { db, isFirebaseConfigured } from '../firebase/config';

const localKey = (uid) => `canva-emprende-user-${uid}`;

const toArray = (value) => (Array.isArray(value) ? value : []);

const compactId = (value = '') =>
  value
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, 8)
    .toUpperCase()
    .padEnd(8, '0');

const formatCertificateDate = (isoDate) =>
  new Intl.DateTimeFormat('es-CR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(isoDate));

const buildCertificateNumber = (uid, issuedAt) => {
  const datePart = formatCertificateDate(issuedAt).replaceAll('/', '');
  return `WST-CPE-${datePart}-${compactId(uid)}`;
};

const applyCertificateMetadata = (profile, stats) => {
  if (stats.totalProgress < 100) return profile;

  const certificateIssuedAt =
    profile.certificateIssuedAt ?? new Date().toISOString();

  return {
    ...profile,
    certificateIssuedAt,
    certificateNumber:
      profile.certificateNumber ??
      buildCertificateNumber(profile.uid, certificateIssuedAt),
    certificateTitle: 'Canva para Emprendedores',
  };
};

export const calculateCourseProgress = (course, completedLessons = []) => {
  const completedSet = new Set(completedLessons);
  const completedCount = course.lessons.filter((lesson) =>
    completedSet.has(lesson.id),
  ).length;

  return Math.round((completedCount / course.lessons.length) * 100);
};

export const isCourseComplete = (course, completedLessons = []) =>
  course.lessons.every((lesson) => completedLessons.includes(lesson.id));

export const isCourseLocked = (course, completedLessons = []) => {
  if (course.level === 0) return false;

  const previousCourse = courses.find(
    (candidate) => candidate.level === course.level - 1,
  );

  return previousCourse ? !isCourseComplete(previousCourse, completedLessons) : false;
};

export const calculateProfileStats = (completedLessons = []) => {
  const uniqueCompleted = [...new Set(completedLessons)];
  const totalProgress = Math.round(
    (uniqueCompleted.length / totalLessonCount) * 100,
  );
  const completedCourses = courses.filter((course) =>
    isCourseComplete(course, uniqueCompleted),
  );
  const firstOpenCourse =
    courses.find((course) => !isCourseComplete(course, uniqueCompleted)) ??
    courses[courses.length - 1];

  return {
    currentLevel: firstOpenCourse.level,
    totalProgress,
    completedCourses,
    certificatesUnlocked: completedCourses.length,
    completedClasses: uniqueCompleted.length,
  };
};

export const getNextLesson = (completedLessons = []) => {
  const completedSet = new Set(completedLessons);
  const availableCourse = courses.find(
    (course) =>
      !isCourseLocked(course, completedLessons) &&
      course.lessons.some((lesson) => !completedSet.has(lesson.id)),
  );

  if (!availableCourse) return null;

  const lesson = availableCourse.lessons.find(
    (candidate) => !completedSet.has(candidate.id),
  );

  return { course: availableCourse, lesson };
};

const baseProfile = (user, accessStatus = 'active') => {
  const name =
    user?.displayName ||
    user?.name ||
    user?.email?.split('@')[0] ||
    'Emprendedor';

  return {
    uid: user.uid,
    name,
    email: user.email ?? '',
    currentLevel: 0,
    totalProgress: 0,
    completedLessons: [],
    favoriteCourses: [],
    accessStatus,
    createdAt: new Date().toISOString(),
  };
};

const normalizeProfile = (user, data = {}, defaultAccessStatus = 'active') => {
  const completedLessons = toArray(data.completedLessons);
  const favoriteCourses = toArray(data.favoriteCourses);
  const stats = calculateProfileStats(completedLessons);

  return {
    ...baseProfile(user, defaultAccessStatus),
    ...data,
    completedLessons,
    favoriteCourses,
    currentLevel: stats.currentLevel,
    totalProgress: stats.totalProgress,
  };
};

const readLocalProfile = (user, defaultAccessStatus = 'active') => {
  const stored = window.localStorage.getItem(localKey(user.uid));
  if (!stored) return normalizeProfile(user, {}, defaultAccessStatus);

  try {
    return normalizeProfile(user, JSON.parse(stored), 'active');
  } catch {
    return normalizeProfile(user, {}, defaultAccessStatus);
  }
};

const writeLocalProfile = (profile) => {
  window.localStorage.setItem(localKey(profile.uid), JSON.stringify(profile));
  return profile;
};

const requestServerCertificate = async (user) => {
  if (typeof user.getIdToken !== 'function') return {};

  const idToken = await user.getIdToken();
  const response = await fetch('/api/certificate-issue', {
    method: 'POST',
    headers: { Authorization: `Bearer ${idToken}` },
  });
  if (!response.ok) return {};
  const data = await response.json();
  return {
    certificateIssuedAt: data.certificateIssuedAt,
    certificateNumber: data.certificateNumber,
    certificateTitle: data.certificateTitle,
  };
};

export const fetchUserProfile = async (user) => {
  if (!user) return null;

  if (!isFirebaseConfigured || !db) {
    const profile = readLocalProfile(user, 'active');
    return writeLocalProfile(profile);
  }

  try {
    if (typeof user.getIdToken === 'function') {
      try {
        const idToken = await user.getIdToken();
        await fetch('/api/hotmart-access', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
      } catch {
        // Firestore sigue siendo la fuente de acceso si la sincronización falla.
      }
    }

    const localProfile = readLocalProfile(user, 'pending_payment');
    const userRef = doc(db, 'users', user.uid);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      const profile = normalizeProfile(user, {
        ...localProfile,
        accessStatus: 'pending_payment',
        syncPending: false,
      }, 'pending_payment');
      await setDoc(userRef, {
        uid: user.uid,
        name: profile.name,
        email: profile.email,
        currentLevel: 0,
        totalProgress: 0,
        completedLessons: [],
        favoriteCourses: [],
        accessStatus: 'pending_payment',
        syncPending: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return writeLocalProfile(profile);
    }

    const remoteProfile = normalizeProfile(user, snapshot.data(), 'active');
    let profile = {
      ...remoteProfile,
      syncPending: false,
    };
    if (profile.totalProgress === 100 && !profile.certificateNumber) {
      try {
        const certificate = await requestServerCertificate(user);
        profile = { ...profile, ...certificate };
      } catch {
        // El perfil sigue disponible aunque la emisión se reintente después.
      }
    }
    await setDoc(
      userRef,
      {
        name: profile.name,
        email: profile.email,
        completedLessons: profile.completedLessons,
        favoriteCourses: profile.favoriteCourses,
        currentLevel: profile.currentLevel,
        totalProgress: profile.totalProgress,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );

    return writeLocalProfile(profile);
  } catch {
    const profile = readLocalProfile(user, 'pending_payment');
    return writeLocalProfile({
      ...profile,
      syncPending: true,
    });
  }
};

export const completeLesson = async (user, lessonId) => {
  const profile = await fetchUserProfile(user);
  const completedLessons = [...new Set([...profile.completedLessons, lessonId])];
  const stats = calculateProfileStats(completedLessons);
  const nextProfile = {
    ...profile,
    completedLessons,
    currentLevel: stats.currentLevel,
    totalProgress: stats.totalProgress,
  };
  const certifiedProfile =
    !isFirebaseConfigured || !db
      ? applyCertificateMetadata(nextProfile, stats)
      : nextProfile;

  if (!isFirebaseConfigured || !db || profile.syncPending) {
    return writeLocalProfile(certifiedProfile);
  }

  try {
    await setDoc(
      doc(db, 'users', user.uid),
      {
        completedLessons: arrayUnion(lessonId),
        currentLevel: stats.currentLevel,
        totalProgress: stats.totalProgress,
        syncPending: false,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  } catch {
    return writeLocalProfile({
      ...certifiedProfile,
      syncPending: true,
    });
  }

  let serverCertificate = {};
  if (stats.totalProgress === 100 && typeof user.getIdToken === 'function') {
    try {
      serverCertificate = await requestServerCertificate(user);
    } catch {
      // El progreso queda guardado y el certificado se reintentará al abrirlo.
    }
  }

  return writeLocalProfile({
    ...certifiedProfile,
    ...serverCertificate,
    syncPending: false,
  });
};

export const getCertificateDisplayDate = (profile) =>
  profile?.certificateIssuedAt
    ? new Intl.DateTimeFormat('es-CR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }).format(new Date(profile.certificateIssuedAt))
    : '';

export const toggleFavoriteCourse = async (user, courseId) => {
  const profile = await fetchUserProfile(user);
  const isFavorite = profile.favoriteCourses.includes(courseId);
  const favoriteCourses = isFavorite
    ? profile.favoriteCourses.filter((favorite) => favorite !== courseId)
    : [...profile.favoriteCourses, courseId];
  const nextProfile = { ...profile, favoriteCourses };

  if (!isFirebaseConfigured || !db || profile.syncPending) {
    return writeLocalProfile(nextProfile);
  }

  try {
    await setDoc(
      doc(db, 'users', user.uid),
      {
        favoriteCourses: isFavorite ? arrayRemove(courseId) : arrayUnion(courseId),
        syncPending: false,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  } catch {
    return writeLocalProfile({
      ...nextProfile,
      syncPending: true,
    });
  }

  return writeLocalProfile({
    ...nextProfile,
    syncPending: false,
  });
};
