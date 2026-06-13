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

## Activación manual temporal

Hasta instalar el Webhook, confirma la compra en Hotmart y abre Firebase:

1. Ve a Firestore Database.
2. Abre la colección `users`.
3. Localiza el documento por el correo utilizado en Hotmart.
4. Cambia `accessStatus` de `pending_payment` a `active`.
5. El alumno pulsa `Ya pagué: actualizar acceso`.

Para un reembolso o contracargo, cambia el valor a `revoked`.

## Pendiente para automatizar la activación

El widget abre y procesa el pago, pero no acredita por sí mismo el perfil. La
aplicación ya bloquea perfiles nuevos; para activar o revocar automáticamente
falta configurar:

1. Webhook de Hotmart con eventos de compra aprobada, reembolso y contracargo.
2. Token secreto del Webhook como variable privada de Vercel.
3. Función de servidor que relacione el correo del comprador con Firebase.
4. Actualización administrativa de `accessStatus` en Firestore.

Las reglas de `firestore.rules` impiden que el alumno cambie por sí mismo los
campos de pago. Deben desplegarse por Firebase CLI o copiarse en la consola.
