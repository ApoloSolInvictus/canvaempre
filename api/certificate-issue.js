import {
  getDocument,
  setDocument,
  updateDocument,
} from '../server/firestore-rest.js';
import { requireActiveUser } from '../server/authorized-user.js';
import {
  buildCertificateNumber,
  certificateDocumentId,
} from '../server/certificate.js';
import { allLessons } from '../server/course-content.js';

const json = (response, status, body) => {
  response.status(status).json(body);
};

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return json(response, 405, { ok: false, error: 'Método no permitido.' });
  }

  try {
    const { claims, path: userPath, user } = await requireActiveUser(request);

    if (user.data.certificateNumber) {
      const existingNumber = user.data.certificateNumber;
      const existingCertificatePath =
        `certificates/${certificateDocumentId(existingNumber)}`;
      const existingCertificate = await getDocument(existingCertificatePath);
      if (!existingCertificate) {
        await setDocument(existingCertificatePath, {
          certificateNumber: existingNumber,
          certificateIssuedAt:
            user.data.certificateIssuedAt ?? new Date(),
          certificateTitle:
            user.data.certificateTitle ?? 'Canva para Emprendedores',
          studentName: user.data.name ?? claims.name ?? 'Emprendedor',
          status: 'valid',
          issuer: 'W Studio',
          updatedAt: new Date(),
        });
      }
      return json(response, 200, {
        ok: true,
        certificateNumber: existingNumber,
        certificateIssuedAt: user.data.certificateIssuedAt,
        certificateTitle:
          user.data.certificateTitle ?? 'Canva para Emprendedores',
      });
    }

    const knownLessonIds = new Set(allLessons.map((lesson) => lesson.id));
    const completedLessons = new Set(
      (user.data.completedLessons ?? []).filter((lessonId) =>
        knownLessonIds.has(lessonId),
      ),
    );

    if (completedLessons.size !== knownLessonIds.size) {
      return json(response, 409, {
        ok: false,
        error: 'Aún faltan clases por completar.',
        completed: completedLessons.size,
        total: knownLessonIds.size,
      });
    }

    const issuedAt = new Date();
    const certificateNumber = buildCertificateNumber(claims.sub, issuedAt);
    const certificateTitle = 'Canva para Emprendedores';
    const certificateData = {
      certificateNumber,
      certificateIssuedAt: issuedAt,
      certificateTitle,
      studentName: user.data.name ?? claims.name ?? 'Emprendedor',
      status: 'valid',
      issuer: 'W Studio',
      updatedAt: issuedAt,
    };

    await updateDocument(userPath, {
      certificateNumber,
      certificateIssuedAt: issuedAt,
      certificateTitle,
      updatedAt: issuedAt,
    });
    await setDocument(
      `certificates/${certificateDocumentId(certificateNumber)}`,
      certificateData,
    );

    return json(response, 200, {
      ok: true,
      certificateNumber,
      certificateIssuedAt: issuedAt.toISOString(),
      certificateTitle,
    });
  } catch (error) {
    console.error('Certificate issue error', error);
    return json(response, error.status ?? 500, {
      ok: false,
      error: error.status ? error.message : 'No se pudo emitir el certificado.',
    });
  }
}
