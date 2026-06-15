import { updateDocument } from '../server/firestore-rest.js';
import { requireActiveUser } from '../server/authorized-user.js';
import {
  allLessons,
  getCourseForLesson,
  getLessonById,
} from '../server/course-content.js';
import {
  calculateServerStats,
  courseUnlocked,
} from '../server/progress-stats.js';

const json = (response, status, body) => {
  response.status(status).json(body);
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
    const passedExams = user.data.passedExams ?? [];
    const currentCourseUnlocked = courseUnlocked(course, passedExams);
    const previousLessonComplete =
      lessonIndex === 0 ||
      completedSet.has(course.lessons[lessonIndex - 1].id);

    if (!currentCourseUnlocked || !previousLessonComplete) {
      return json(response, 409, {
        ok: false,
        error: currentCourseUnlocked
          ? 'Completa primero las clases anteriores.'
          : 'Aprueba primero el examen del nivel anterior.',
      });
    }

    completedSet.add(lessonId);
    const completedLessons = [...completedSet];
    const stats = calculateServerStats(completedLessons, passedExams);

    await updateDocument(path, {
      completedLessons: stats.completedLessons,
      currentLevel: stats.currentLevel,
      totalProgress: stats.totalProgress,
      updatedAt: new Date(),
    });

    return json(response, 200, {
      ok: true,
      completedLessons: stats.completedLessons,
      passedExams: stats.passedExams,
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
