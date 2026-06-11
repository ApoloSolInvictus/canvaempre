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

const uniqueValues = (...lists) => [...new Set(lists.flatMap((list) => toArray(list)))];

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

const baseProfile = (user) => {
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
    createdAt: new Date().toISOString(),
  };
};

const normalizeProfile = (user, data = {}) => {
  const completedLessons = toArray(data.completedLessons);
  const favoriteCourses = toArray(data.favoriteCourses);
  const stats = calculateProfileStats(completedLessons);

  return {
    ...baseProfile(user),
    ...data,
    completedLessons,
    favoriteCourses,
    currentLevel: stats.currentLevel,
    totalProgress: stats.totalProgress,
  };
};

const readLocalProfile = (user) => {
  const stored = window.localStorage.getItem(localKey(user.uid));
  if (!stored) return normalizeProfile(user);

  try {
    return normalizeProfile(user, JSON.parse(stored));
  } catch {
    return normalizeProfile(user);
  }
};

const writeLocalProfile = (profile) => {
  window.localStorage.setItem(localKey(profile.uid), JSON.stringify(profile));
  return profile;
};

const mergeProfiles = (user, remoteProfile, localProfile) =>
  normalizeProfile(user, {
    ...remoteProfile,
    completedLessons: uniqueValues(
      remoteProfile?.completedLessons,
      localProfile?.completedLessons,
    ),
    favoriteCourses: uniqueValues(
      remoteProfile?.favoriteCourses,
      localProfile?.favoriteCourses,
    ),
  });

export const fetchUserProfile = async (user) => {
  if (!user) return null;

  if (!isFirebaseConfigured || !db) {
    const profile = readLocalProfile(user);
    return writeLocalProfile(profile);
  }

  try {
    const localProfile = readLocalProfile(user);
    const userRef = doc(db, 'users', user.uid);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      const profile = normalizeProfile(user, {
        ...localProfile,
        syncPending: false,
      });
      await setDoc(userRef, {
        ...profile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return writeLocalProfile(profile);
    }

    const remoteProfile = normalizeProfile(user, snapshot.data());
    const profile = {
      ...mergeProfiles(user, remoteProfile, localProfile),
      syncPending: false,
    };
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
    const profile = readLocalProfile(user);
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

  if (!isFirebaseConfigured || !db || profile.syncPending) {
    return writeLocalProfile(nextProfile);
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
      ...nextProfile,
      syncPending: true,
    });
  }

  return writeLocalProfile({
    ...nextProfile,
    syncPending: false,
  });
};

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
