export default function handler(_request, response) {
  response.setHeader('Cache-Control', 'no-store');
  response.status(404).json({
    ok: false,
    error: 'Este recurso requiere iniciar sesión desde la plataforma.',
  });
}
