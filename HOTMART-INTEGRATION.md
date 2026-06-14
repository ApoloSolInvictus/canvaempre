# Integración Hotmart

## Enlaces configurados

- Página de ventas: https://go.hotmart.com/B106307027H
- Página de producto: https://go.hotmart.com/B106307027H?dp=1
- Página de pago: https://pay.hotmart.com/B106307027H
- Checkout modal: https://pay.hotmart.com/B106307027H?checkoutMode=2

## Rutas de la aplicación

- Compra: https://canvaempren.wstudio3d.com/comprar
- Compra aprobada: https://canvaempren.wstudio3d.com/compra/aprobada
- Compra pendiente: https://canvaempren.wstudio3d.com/compra/pendiente

Configura las dos últimas rutas en Hotmart como destinos posteriores al pago,
si el panel de configuración de checkout permite separar el resultado aprobado
del pago pendiente.

## Flujo actual

1. El visitante abre la pantalla de compra.
2. Crea su perfil o inicia sesión.
3. Regresa automáticamente a `/comprar`.
4. Abre el checkout seguro mediante el widget oficial de Hotmart.
5. Hotmart procesa el pago fuera de la aplicación.
6. Los perfiles nuevos quedan con `accessStatus: pending_payment`.
7. Los alumnos existentes sin ese campo conservan su acceso.

## Activación automática

La ruta `api/hotmart-webhook.js` procesa los eventos de Hotmart:

- `PURCHASE_APPROVED`, `PURCHASE_COMPLETE`: acceso `active`.
- `PURCHASE_REFUNDED`, `PURCHASE_CHARGEBACK`: acceso `revoked`.
- Cancelaciones y vencimientos definitivos: acceso `revoked`.

Cada compra se guarda también por correo en `hotmartEntitlements`. La ruta
`api/hotmart-access.js` permite reclamar automáticamente una compra si el
Webhook llegó antes de que el comprador creara su perfil.

## Variables privadas de Vercel

Configura en Vercel para Production y Preview:

- `FIREBASE_ADMIN_PROJECT_ID`
- `FIREBASE_ADMIN_CLIENT_EMAIL`
- `FIREBASE_ADMIN_PRIVATE_KEY`
- `HOTMART_HOTTOK`
- `HOTMART_PRODUCT_ID` (recomendado)
- `HOTMART_OFFER_CODE` (opcional)
- `WEBHOOK_ALERT_URL` (Slack o Discord, opcional)
- `RESEND_API_KEY`, `ALERT_EMAIL_TO`, `ALERT_EMAIL_FROM` (alerta por email,
  opcional)

No agregues el prefijo `VITE_`: estas credenciales deben existir solo en el
servidor.

Los tres valores `FIREBASE_ADMIN_*` salen del JSON generado en Firebase:
Configuración del proyecto > Cuentas de servicio > Generar nueva clave privada.
Guarda la clave solo en Vercel; nunca la subas al repositorio.

`HOTMART_PRODUCT_ID` debe contener el valor numérico que aparece en
`data.product.id` dentro del historial del Webhook. Después de agregar o
modificar variables, vuelve a desplegar el proyecto en Vercel.

## Configuración en Hotmart

1. Abre Herramientas y selecciona Webhook (API y notificaciones).
2. Registra la URL:
   `https://canvaempren.wstudio3d.com/api/hotmart-webhook`
3. Selecciona el producto Canva Emprende.
4. Marca compra aprobada, compra completada, compra reembolsada, chargeback,
   compra cancelada y compra con plazo vencido.
5. Copia el Hottok de Hotmart en la variable privada `HOTMART_HOTTOK`.
6. Envía una prueba desde el Historial del Webhook y confirma respuesta 200.

### Contacto y garantía

1. Confirma que el correo público del Productor sea `info@wstudiocr.com`.
   Hotmart muestra ese correo al pulsar "Ponte en contacto" en el checkout y en
   los mensajes de compra.
2. Si el checkout muestra otro correo y Hotmart no permite editarlo, solicita
   el cambio desde el Soporte de Hotmart.
3. Configura el plazo de garantía del producto en 7 días o cambia
   `VITE_GUARANTEE_DAYS` al mismo valor que elijas en Hotmart.
4. Actualiza también la página de ventas para que muestre exactamente ese
   plazo.

Las reglas de `firestore.rules` impiden que el alumno cambie por sí mismo los
campos de pago.

## Verificación

1. Abre
   `https://canvaempren.wstudio3d.com/api/hotmart-webhook`.
2. Confirma una respuesta JSON con `ok: true`, `configured: true` y revisa
   `alertsConfigured`.
3. Haz una compra real de prueba con el mismo correo usado en el perfil.
4. Confirma en Firestore los documentos de `hotmartEntitlements`,
   `hotmartWebhookEvents` y el campo `users/{uid}.accessStatus: active`.
5. Reenvía el mismo evento desde Hotmart. Debe responder 200 sin duplicar el
   acceso.

El correo de compra y el correo del perfil deben coincidir. Si el Webhook llega
antes del registro, el alumno recibe el acceso al iniciar sesión por primera
vez con ese mismo correo.

## Firebase Authentication

1. En Authentication > Settings > Authorized domains, confirma
   `canvaempren.wstudio3d.com`.
2. En Authentication > Templates, personaliza "Verificación de dirección de
   correo" y "Restablecimiento de contraseña" con la marca W Studio.
3. Despliega `firestore.rules`. Las reglas nuevas bloquean escrituras del
   cliente en catálogo, pagos y certificados.

## Analítica y campañas

Configura en Vercel para Production:

- `VITE_GA_MEASUREMENT_ID`: identificador de flujo web de GA4, por ejemplo
  `G-XXXXXXXXXX`.
- `VITE_META_PIXEL_ID`: identificador numérico del Meta Pixel.

La app guarda UTMs y `gclid`/`fbclid`, los adjunta al checkout y solo carga GA4
o Meta Pixel cuando el visitante da consentimiento. Prueba en los paneles:

1. GA4 DebugView: `page_view`, `view_item`, `sign_up`, `begin_checkout`,
   `purchase` y `resource_download`.
2. Meta Events Manager: `PageView`, `ViewContent`, `CompleteRegistration`,
   `InitiateCheckout` y `Purchase`.

## Alertas

Usa una de estas opciones:

- `WEBHOOK_ALERT_URL`: URL entrante de Slack o Discord.
- Resend: `RESEND_API_KEY`, `ALERT_EMAIL_TO=info@wstudiocr.com` y un
  `ALERT_EMAIL_FROM` perteneciente a un dominio verificado.

Las alertas incluyen evento, transacción y producto, pero no incluyen el correo
ni el nombre del comprador.
