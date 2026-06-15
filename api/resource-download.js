import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
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
    const courseId = String(request.query?.courseId ?? '');
    const resourceIndex = Number(request.query?.index);
    const course = getCourseById(courseId);

    if (
      !course ||
      !Number.isInteger(resourceIndex) ||
      resourceIndex < 0 ||
      resourceIndex >= course.resources.length
    ) {
      return json(response, 404, {
        ok: false,
        error: 'No encontramos ese recurso.',
      });
    }

    const fileName = `${courseId}-recurso-${resourceIndex + 1}.pdf`;
    const file = await readFile(
      join(process.cwd(), 'private', 'recursos', fileName),
    );

    response.setHeader('Cache-Control', 'private, no-store');
    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader(
      'Content-Disposition',
      `attachment; filename="${fileName}"`,
    );
    return response.status(200).send(file);
  } catch (error) {
    return json(response, error.status ?? 500, {
      ok: false,
      error: error.status ? error.message : 'No se pudo descargar el recurso.',
    });
  }
}
