import { getLessonById } from '../server/course-content.js';
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
    await requireActiveUser(request);
    const lesson = getLessonById(String(request.query?.id ?? ''));
    if (!lesson) {
      return json(response, 404, {
        ok: false,
        error: 'No encontramos esa lección.',
      });
    }

    response.setHeader('Cache-Control', 'private, no-store');
    return json(response, 200, {
      ok: true,
      lesson: {
        id: lesson.id,
        summary: lesson.summary,
        goals: lesson.goals,
        steps: lesson.steps,
        practice: lesson.practice,
        assignment: lesson.assignment,
      },
    });
  } catch (error) {
    return json(response, error.status ?? 500, {
      ok: false,
      error: error.status ? error.message : 'No se pudo cargar la lección.',
    });
  }
}
