import { updateDocument } from '../server/firestore-rest.js';
import { requireActiveUser } from '../server/authorized-user.js';
import {
  allLessons,
  courses,
  getCourseForLesson,
  getLessonById,
} from '../server/course-content.js';

const json = (response, status, body) => {
  response.status(status).json(body);
};

const calculateStats = (completedLessons) => {
  const completedSet = new Set(completedLessons);
  const completedCourses = courses.filter((course) =>
    course.lessons.every((lesson) => completedSet.has(lesson.id)),
  );
  const firstOpenCourse =
    courses.find((course) =>
      course.lessons.some((lesson) => !completedSet.has(lesson.id)),
    ) ?? courses[courses.length - 1];

  return {
    currentLevel: firstOpenCourse.level,
    totalProgress: Math.round(
      (completedSet.size / allLessons.length) * 100,
    ),
    completedCourses: completedCourses.length,
  };
};

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return json(response, 405, { ok: false, error: 'Método no permitido.' });
  }

  try {
    const { path, user } = await requireActiveUser(request);
    const lessonId = String(request.body?.lessonId ?? '');
    const lesson = getLessonById(lessonId);
    const course = getCourseForLesson(lessonId);
    if (!lesson || !course) {
      return json(response, 404, {
        ok: false,
        error: 'No encontramos esa lección.',
      });
    }

    const knownLessonIds = new Set(allLessons.map((item) => item.id));
    const completedSet = new Set(
      (user.data.completedLessons ?? []).filter((id) =>
        knownLessonIds.has(id),
      ),
    );
    const lessonIndex = course.lessons.findIndex(
      (item) => item.id === lessonId,
    );
    const previousCourse = courses.find(
      (item) => item.level === course.level - 1,
    );
    const previousCourseComplete =
      !previousCourse ||
      previousCourse.lessons.every((item) => completedSet.has(item.id));
    const previousLessonComplete =
      lessonIndex === 0 ||
      completedSet.has(course.lessons[lessonIndex - 1].id);

    if (!previousCourseComplete || !previousLessonComplete) {
      return json(response, 409, {
        ok: false,
        error: 'Completa primero las clases anteriores.',
      });
    }

    completedSet.add(lessonId);
    const completedLessons = [...completedSet];
    const stats = calculateStats(completedLessons);

    await updateDocument(path, {
      completedLessons,
      currentLevel: stats.currentLevel,
      totalProgress: stats.totalProgress,
      updatedAt: new Date(),
    });

    return json(response, 200, {
      ok: true,
      completedLessons,
      currentLevel: stats.currentLevel,
      totalProgress: stats.totalProgress,
    });
  } catch (error) {
    return json(response, error.status ?? 500, {
      ok: false,
      error: error.status ? error.message : 'No se pudo guardar el progreso.',
    });
  }
}
