const hasEmailAlert = () =>
  Boolean(
    process.env.RESEND_API_KEY &&
      process.env.ALERT_EMAIL_TO &&
      process.env.ALERT_EMAIL_FROM,
  );

export const alertsConfigured = () =>
  Boolean(process.env.WEBHOOK_ALERT_URL || hasEmailAlert());

const postWebhookAlert = async (message) => {
  const url = process.env.WEBHOOK_ALERT_URL;
  if (!url) return;

  const isDiscord = new URL(url).hostname.includes('discord.com');
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(isDiscord ? { content: message } : { text: message }),
    signal: AbortSignal.timeout(5_000),
  });

  if (!response.ok) {
    throw new Error(`El webhook de alertas respondió ${response.status}.`);
  }
};

const sendEmailAlert = async (subject, message) => {
  if (!hasEmailAlert()) return;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.ALERT_EMAIL_FROM,
      to: [process.env.ALERT_EMAIL_TO],
      subject,
      text: message,
    }),
    signal: AbortSignal.timeout(5_000),
  });

  if (!response.ok) {
    throw new Error(`Resend respondió ${response.status}.`);
  }
};

export const notifyWebhookError = async (error, context = {}) => {
  if (!alertsConfigured()) return;

  const message = [
    'Canva para Emprender: error en webhook de Hotmart',
    `Fecha: ${new Date().toISOString()}`,
    `Evento: ${context.event || 'desconocido'}`,
    `Evento ID: ${context.eventId || 'desconocido'}`,
    `Transacción: ${context.transaction || 'desconocida'}`,
    `Producto: ${context.productId || 'desconocido'}`,
    `Detalle: ${error?.message || 'Error no identificado'}`,
  ].join('\n');

  const results = await Promise.allSettled([
    postWebhookAlert(message),
    sendEmailAlert('Error en webhook de Hotmart', message),
  ]);
  results.forEach((result) => {
    if (result.status === 'rejected') {
      console.error('No se pudo enviar una alerta del webhook', result.reason);
    }
  });
};

