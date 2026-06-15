import { courses } from '../server/course-content.js';
import { getPublicExam } from '../server/exam-content.js';
import {
  courseLessonsComplete,
  courseUnlocked,
} from '../server/progress-stats.js';
import { requireActiveUser } from '../server/authorized-user.js';

const json = (response, status, body) => {
  response.status(status).json(body);
};

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return json(response, 405, { ok: false, error: 'Método no permitido.' });
  }

  try {
    const { user } = await requireActiveUser(request);
    const courseId = String(request.query?.courseId ?? '');
    const course = courses.find((candidate) => candidate.id === courseId);
    const exam = getPublicExam(courseId);

    if (!course || !exam) {
      return json(response, 404, {
        ok: false,
        error: 'No encontramos ese examen.',
      });
    }

    const completedLessons = user.data.completedLessons ?? [];
    const passedExams = user.data.passedExams ?? [];
    if (!courseUnlocked(course, passedExams)) {
      return json(response, 409, {
        ok: false,
        error: 'Aprueba primero el examen del nivel anterior.',
      });
    }
    if (!courseLessonsComplete(course, completedLessons)) {
      return json(response, 409, {
        ok: false,
        error: 'Completa las ocho clases antes de comenzar el examen.',
      });
    }

    response.setHeader('Cache-Control', 'private, no-store');
    return json(response, 200, {
      ok: true,
      exam,
      previousResult: user.data.examResults?.[courseId] ?? null,
    });
  } catch (error) {
    return json(response, error.status ?? 500, {
      ok: false,
      error: error.status ? error.message : 'No se pudo cargar el examen.',
    });
  }
}
