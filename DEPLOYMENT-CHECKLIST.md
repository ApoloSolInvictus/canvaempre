# Checklist de producción

## Vercel

- Node.js 22.12 o superior.
- Agregar las variables de `.env.production.example`.
- Configurar GA4, Meta Pixel y alertas.
- Volver a desplegar después de cambiar variables.
- Confirmar CSP, `X-Frame-Options: DENY` y `Permissions-Policy`.

## Firebase

- Autorizar `canvaempren.wstudio3d.com` en Authentication.
- Personalizar correos de verificación y contraseña.
- Seleccionar el proyecto correcto con `firebase use <project-id>`.
- Desplegar las reglas con `firebase deploy --only firestore:rules`.
- Probar registro, verificación, recuperación y Google.

## Hotmart

- Correo público del Productor: `info@wstudiocr.com`.
- Garantía igual a `VITE_GUARANTEE_DAYS`.
- URL de compra aprobada: `/compra/aprobada`.
- URL de compra pendiente: `/compra/pendiente`.
- Webhook activo con aprobación, reembolso, chargeback, cancelación y
  vencimiento.
- Probar compra real y reembolso.

## Medición

- Aceptar cookies en un navegador de prueba.
- Ver eventos en GA4 DebugView.
- Ver eventos en Meta Events Manager.
- Probar URLs con `utm_source`, `utm_medium` y `utm_campaign`.

## Validación final

- Compra aprobada activa el perfil.
- Reembolso revoca el perfil.
- Los 15 PDFs descargan correctamente.
- El certificado se emite en servidor al completar 40 clases.
- `/verificar-certificado` valida el número emitido.
- Soporte y documentos legales son accesibles desde móvil.
