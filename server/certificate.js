import { createHash } from 'node:crypto';

export const certificateDocumentId = (certificateNumber) =>
  createHash('sha256')
    .update(certificateNumber.trim().toUpperCase())
    .digest('hex');

export const buildCertificateNumber = (uid, issuedAt = new Date()) => {
  const datePart = issuedAt.toISOString().slice(0, 10).replaceAll('-', '');
  const userPart = createHash('sha256')
    .update(uid)
    .digest('hex')
    .slice(0, 8)
    .toUpperCase();
  return `WST-CPE-${datePart}-${userPart}`;
};

