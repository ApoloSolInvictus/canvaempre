import test from 'node:test';
import assert from 'node:assert/strict';
import {
  alertsConfigured,
  notifyWebhookError,
} from '../server/alerts.js';
import {
  buildCertificateNumber,
  certificateDocumentId,
} from '../server/certificate.js';

test('genera números de certificado estables sin exponer el uid', () => {
  const issuedAt = new Date('2026-06-14T12:00:00.000Z');
  const number = buildCertificateNumber('firebase-user-secret', issuedAt);

  assert.match(number, /^WST-CPE-20260614-[A-F0-9]{8}$/);
  assert.equal(number.includes('firebase-user-secret'), false);
  assert.equal(certificateDocumentId(number).length, 64);
  assert.equal(certificateDocumentId(number), certificateDocumentId(number));
});

test('envía alertas operativas sin datos personales', async () => {
  process.env.WEBHOOK_ALERT_URL = 'https://hooks.slack.com/services/test';
  const originalFetch = global.fetch;
  let request = null;
  global.fetch = async (url, options) => {
    request = { url: String(url), options };
    return new Response('', { status: 200 });
  };

  try {
    assert.equal(alertsConfigured(), true);
    await notifyWebhookError(new Error('Firestore no disponible'), {
      event: 'PURCHASE_APPROVED',
      eventId: 'event-1',
      transaction: 'HP123',
      productId: '7927332',
    });
  } finally {
    global.fetch = originalFetch;
    delete process.env.WEBHOOK_ALERT_URL;
  }

  const body = JSON.parse(request.options.body);
  assert.equal(request.url, 'https://hooks.slack.com/services/test');
  assert.match(body.text, /PURCHASE_APPROVED/);
  assert.match(body.text, /HP123/);
  assert.equal(body.text.includes('@'), false);
});

