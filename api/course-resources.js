import { getCourseById } from '../server/course-content.js';
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
    const course = getCourseById(String(request.query?.courseId ?? ''));
    if (!course) {
      return json(response, 404, {
        ok: false,
        error: 'No encontramos ese módulo.',
      });
    }

    response.setHeader('Cache-Control', 'private, no-store');
    return json(response, 200, {
      ok: true,
      resources: course.resources.map((resource, index) => ({
        index,
        type: resource.type,
        title: resource.title,
        description: resource.description,
        items: resource.items,
        useCase: resource.useCase,
      })),
    });
  } catch (error) {
    return json(response, error.status ?? 500, {
      ok: false,
      error: error.status ? error.message : 'No se pudieron cargar los recursos.',
    });
  }
}
