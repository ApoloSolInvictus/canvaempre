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
import lessonContentHandler from '../api/lesson-content.js';
import courseResourcesHandler from '../api/course-resources.js';
import progressCompleteHandler from '../api/progress-complete.js';
import resourceDownloadHandler from '../api/resource-download.js';
import examContentHandler from '../api/exam-content.js';
import examSubmitHandler from '../api/exam-submit.js';

const createJsonResponse = () => {
  let statusCode = 0;
  let body = null;

  return {
    response: {
      setHeader() {},
      status(code) {
        statusCode = code;
        return this;
      },
      json(value) {
        body = value;
        return this;
      },
      send(value) {
        body = value;
        return this;
      },
    },
    result: () => ({ statusCode, body }),
  };
};

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

test('protege lecciones, recursos, descargas y progreso sin sesión', async () => {
  const endpoints = [
    {
      handler: lessonContentHandler,
      request: { method: 'GET', headers: {}, query: { id: 'lesson' } },
    },
    {
      handler: courseResourcesHandler,
      request: { method: 'GET', headers: {}, query: { courseId: 'course' } },
    },
    {
      handler: resourceDownloadHandler,
      request: {
        method: 'GET',
        headers: {},
        query: { courseId: 'course', index: '0' },
      },
    },
    {
      handler: progressCompleteHandler,
      request: {
        method: 'POST',
        headers: {},
        body: { lessonId: 'lesson' },
      },
    },
    {
      handler: examContentHandler,
      request: {
        method: 'GET',
        headers: {},
        query: { courseId: 'course' },
      },
    },
    {
      handler: examSubmitHandler,
      request: {
        method: 'POST',
        headers: {},
        body: { courseId: 'course', answers: {} },
      },
    },
  ];

  for (const { handler, request } of endpoints) {
    const { response, result } = createJsonResponse();
    await handler(request, response);
    assert.equal(result().statusCode, 401);
    assert.equal(result().body.ok, false);
  }
});
