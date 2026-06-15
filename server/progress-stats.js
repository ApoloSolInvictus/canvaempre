import { allLessons, courses } from './course-content.js';
import { examCourseIds } from './exam-content.js';

const knownLessonIds = new Set(allLessons.map((lesson) => lesson.id));
const knownExamIds = new Set(examCourseIds);

export const normalizeCompletedLessons = (completedLessons = []) =>
  [...new Set(completedLessons)].filter((id) => knownLessonIds.has(id));

export const normalizePassedExams = (passedExams = []) =>
  [...new Set(passedExams)].filter((id) => knownExamIds.has(id));

export const courseLessonsComplete = (course, completedLessons = []) => {
  const completedSet = new Set(completedLessons);
  return course.lessons.every((lesson) => completedSet.has(lesson.id));
};

export const courseUnlocked = (course, passedExams = []) => {
  if (course.level === 0) return true;
  const previousCourse = courses.find(
    (candidate) => candidate.level === course.level - 1,
  );
  return previousCourse ? passedExams.includes(previousCourse.id) : false;
};

export const calculateServerStats = (
  completedLessons = [],
  passedExams = [],
) => {
  const normalizedLessons = normalizeCompletedLessons(completedLessons);
  const normalizedExams = normalizePassedExams(passedExams);
  const passedSet = new Set(normalizedExams);
  const totalMilestones = allLessons.length + examCourseIds.length;
  const completedMilestones = normalizedLessons.length + normalizedExams.length;
  const firstPendingCourse =
    courses.find((course) => !passedSet.has(course.id)) ??
    courses[courses.length - 1];

  return {
    completedLessons: normalizedLessons,
    passedExams: normalizedExams,
    currentLevel: firstPendingCourse.level,
    totalProgress: Math.round(
      (completedMilestones / totalMilestones) * 100,
    ),
    completedCourses: normalizedExams.length,
    allRequirementsComplete:
      normalizedLessons.length === allLessons.length &&
      normalizedExams.length === examCourseIds.length,
  };
};
