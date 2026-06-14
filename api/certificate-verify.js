import { getDocument } from '../server/firestore-rest.js';
import { certificateDocumentId } from '../server/certificate.js';

const json = (response, status, body) => {
  response.status(status).json(body);
};

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return json(response, 405, { ok: false, error: 'Método no permitido.' });
  }

  response.setHeader('Cache-Control', 'no-store');
  const certificateNumber = String(request.query?.number ?? '').trim();
  if (!certificateNumber) {
    return json(response, 400, {
      ok: false,
      error: 'Escribe un número de certificado.',
    });
  }

  try {
    const certificate = await getDocument(
      `certificates/${certificateDocumentId(certificateNumber)}`,
    );
    if (!certificate || certificate.data.status !== 'valid') {
      return json(response, 404, {
        ok: false,
        valid: false,
        error: 'No encontramos un certificado válido con ese número.',
      });
    }

    return json(response, 200, {
      ok: true,
      valid: true,
      certificate: {
        certificateNumber: certificate.data.certificateNumber,
        certificateIssuedAt: certificate.data.certificateIssuedAt,
        certificateTitle: certificate.data.certificateTitle,
        studentName: certificate.data.studentName,
        issuer: certificate.data.issuer,
      },
    });
  } catch (error) {
    console.error('Certificate verification error', error);
    return json(response, 500, {
      ok: false,
      error: 'No se pudo verificar el certificado.',
    });
  }
}

