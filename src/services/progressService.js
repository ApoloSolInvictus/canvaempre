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
import { submitExamAnswers } from './protectedContent';

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

const totalExamCount = courses.length;
const totalMilestoneCount = totalLessonCount + totalExamCount;

export const calculateCourseProgress = (
  course,
  completedLessons = [],
  passedExams = [],
) => {
  const completedSet = new Set(completedLessons);
  const completedCount = course.lessons.filter((lesson) =>
    completedSet.has(lesson.id),
  ).length;
  const examCount = passedExams.includes(course.id) ? 1 : 0;

  return Math.round(
    ((completedCount + examCount) / (course.lessons.length + 1)) * 100,
  );
};

export const areCourseLessonsComplete = (course, completedLessons = []) =>
  course.lessons.every((lesson) => completedLessons.includes(lesson.id));

export const isCourseComplete = (
  course,
  completedLessons = [],
  passedExams = [],
) =>
  areCourseLessonsComplete(course, completedLessons) &&
  passedExams.includes(course.id);

export const isCourseLocked = (
  course,
  completedLessons = [],
  passedExams = [],
) => {
  if (course.level === 0) return false;

  const previousCourse = courses.find(
    (candidate) => candidate.level === course.level - 1,
  );

  return previousCourse ? !passedExams.includes(previousCourse.id) : false;
};

export const calculateProfileStats = (
  completedLessons = [],
  passedExams = [],
) => {
  const uniqueCompleted = [...new Set(completedLessons)];
  const uniquePassedExams = [...new Set(passedExams)].filter((courseId) =>
    courses.some((course) => course.id === courseId),
  );
  const totalProgress = Math.round(
    ((uniqueCompleted.length + uniquePassedExams.length) /
      totalMilestoneCount) *
      100,
  );
  const completedCourses = courses.filter((course) =>
    uniquePassedExams.includes(course.id),
  );
  const firstOpenCourse =
    courses.find((course) => !uniquePassedExams.includes(course.id)) ??
    courses[courses.length - 1];

  return {
    currentLevel: firstOpenCourse.level,
    totalProgress,
    completedCourses,
    certificatesUnlocked: totalProgress === 100 ? 1 : 0,
    completedClasses: uniqueCompleted.length,
    passedExamCount: uniquePassedExams.length,
    allRequirementsComplete:
      uniqueCompleted.length === totalLessonCount &&
      uniquePassedExams.length === totalExamCount,
  };
};

export const getNextLesson = (
  completedLessons = [],
  passedExams = [],
) => {
  const completedSet = new Set(completedLessons);
  const availableCourses = courses.filter(
    (course) => !isCourseLocked(course, completedLessons, passedExams),
  );

  for (const course of availableCourses) {
    const lesson = course.lessons.find(
      (candidate) => !completedSet.has(candidate.id),
    );
    if (lesson) return { course, lesson, exam: false };
    if (!passedExams.includes(course.id)) {
      return { course, lesson: null, exam: true };
    }
  }

  return null;
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
    passedExams: [],
    examResults: {},
    favoriteCourses: [],
    accessStatus,
    createdAt: new Date().toISOString(),
  };
};

const normalizeProfile = (user, data = {}, defaultAccessStatus = 'active') => {
  const completedLessons = toArray(data.completedLessons);
  const passedExams = toArray(data.passedExams);
  const favoriteCourses = toArray(data.favoriteCourses);
  const stats = calculateProfileStats(completedLessons, passedExams);

  return {
    ...baseProfile(user, defaultAccessStatus),
    ...data,
    completedLessons,
    passedExams,
    examResults: data.examResults ?? {},
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

const requestServerProgress = async (user, lessonId) => {
  if (typeof user.getIdToken !== 'function') {
    throw new Error('Necesitas iniciar sesión nuevamente.');
  }

  const response = await fetch('/api/progress-complete', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${await user.getIdToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ lessonId }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'No se pudo guardar el progreso.');
  }
  return data;
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

  if (isFirebaseConfigured && db && !profile.syncPending) {
    const serverProgress = await requestServerProgress(user, lessonId);
    const nextProfile = {
      ...profile,
      completedLessons: serverProgress.completedLessons,
      passedExams: serverProgress.passedExams ?? profile.passedExams,
      currentLevel: serverProgress.currentLevel,
      totalProgress: serverProgress.totalProgress,
      syncPending: false,
    };

    let serverCertificate = {};
    if (
      serverProgress.totalProgress === 100 &&
      typeof user.getIdToken === 'function'
    ) {
      try {
        serverCertificate = await requestServerCertificate(user);
      } catch {
        // El certificado se reintentará al abrir el perfil.
      }
    }

    return writeLocalProfile({
      ...nextProfile,
      ...serverCertificate,
    });
  }

  const completedLessons = [...new Set([...profile.completedLessons, lessonId])];
  const stats = calculateProfileStats(
    completedLessons,
    profile.passedExams,
  );
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

  return writeLocalProfile(certifiedProfile);
};

export const submitExamAttempt = async (user, courseId, answers) => {
  const profile = await fetchUserProfile(user);
  const result = await submitExamAnswers(user, courseId, answers);
  const previousExamResult = profile.examResults?.[courseId] ?? {};
  const examResult = user?.isDemo
    ? {
        ...result.examResult,
        attempts: (previousExamResult.attempts ?? 0) + 1,
        bestScore: Math.max(
          previousExamResult.bestScore ?? 0,
          result.score,
        ),
        passed: Boolean(previousExamResult.passed || result.passed),
        passedAt:
          previousExamResult.passedAt ??
          (result.passed ? new Date().toISOString() : null),
      }
    : result.examResult;
  const passedExams = result.passed
    ? [...new Set([...profile.passedExams, courseId])]
    : profile.passedExams;
  const examResults = {
    ...(profile.examResults ?? {}),
    [courseId]: examResult,
  };
  const stats = calculateProfileStats(
    profile.completedLessons,
    result.passedExams ?? passedExams,
  );
  const nextProfile = {
    ...profile,
    passedExams: result.passedExams ?? passedExams,
    examResults,
    currentLevel: result.currentLevel ?? stats.currentLevel,
    totalProgress: result.totalProgress ?? stats.totalProgress,
    syncPending: false,
  };
  const finalProfile =
    user?.isDemo && stats.totalProgress === 100
      ? applyCertificateMetadata(nextProfile, stats)
      : nextProfile;

  return {
    result: {
      ...result,
      examResult,
    },
    profile: writeLocalProfile(finalProfile),
  };
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
