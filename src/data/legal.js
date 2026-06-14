import { SITE_CONFIG } from '../config/site';

export const legalDocuments = {
  privacidad: {
    eyebrow: 'Información legal',
    title: 'Política de privacidad',
    description: `Última actualización: ${SITE_CONFIG.legalUpdatedAt}.`,
    sections: [
      {
        title: 'Responsable',
        paragraphs: [
          `${SITE_CONFIG.company}, con operación en ${SITE_CONFIG.country}, administra Canva para Emprender. Puedes escribir a ${SITE_CONFIG.supportEmail} para consultas sobre tus datos.`,
        ],
      },
      {
        title: 'Datos que tratamos',
        bullets: [
          'Nombre, correo y datos básicos del perfil.',
          'Progreso, clases completadas, favoritos y certificado.',
          'Estado de compra y transacción enviado por Hotmart.',
          'Datos técnicos y de campaña cuando autorizas analítica o marketing.',
        ],
      },
      {
        title: 'Para qué los utilizamos',
        bullets: [
          'Crear y proteger tu cuenta.',
          'Entregar el acceso comprado y guardar tu progreso.',
          'Emitir el certificado al completar el programa.',
          'Atender soporte, prevenir fraude y medir campañas con tu consentimiento.',
        ],
      },
      {
        title: 'Proveedores',
        paragraphs: [
          'Utilizamos Firebase para autenticación y base de datos, Vercel para alojamiento, Hotmart para pagos y, únicamente con consentimiento, Google Analytics y Meta Pixel para medición.',
        ],
      },
      {
        title: 'Conservación y derechos',
        paragraphs: [
          `Conservamos la información mientras tu cuenta o las obligaciones comerciales lo requieran. Puedes solicitar acceso, corrección o eliminación escribiendo a ${SITE_CONFIG.supportEmail}. Algunos registros de compra deben conservarse por obligaciones legales y antifraude. El nombre, número y estado de un certificado emitido pueden consultarse públicamente para validar su autenticidad.`,
        ],
      },
      {
        title: 'Cookies',
        paragraphs: [
          'Las cookies necesarias mantienen la sesión y seguridad. La analítica y publicidad permanecen desactivadas hasta que las aceptas y puedes cambiar tu decisión desde “Cookies” en el pie de página.',
        ],
      },
    ],
  },
  terminos: {
    eyebrow: 'Información legal',
    title: 'Términos de uso',
    description: `Última actualización: ${SITE_CONFIG.legalUpdatedAt}.`,
    sections: [
      {
        title: 'Servicio',
        paragraphs: [
          'Canva para Emprender es un programa educativo digital de acceso individual. La compra otorga una licencia personal, limitada y no transferible para utilizar las clases, recursos y certificado.',
        ],
      },
      {
        title: 'Cuenta y acceso',
        bullets: [
          'Debes proporcionar información correcta y mantener segura tu contraseña.',
          'El correo del perfil debe coincidir con el correo utilizado en Hotmart.',
          'No está permitido compartir, revender o publicar el contenido del curso.',
          'Podemos suspender accesos asociados a reembolso, contracargo, fraude o abuso.',
        ],
      },
      {
        title: 'Contenido y resultados',
        paragraphs: [
          'El curso ofrece formación práctica, pero no garantiza resultados comerciales, ingresos ni aprobación de campañas. Los resultados dependen de la aplicación personal y de factores externos.',
        ],
      },
      {
        title: 'Propiedad intelectual y Canva',
        paragraphs: [
          `El contenido propio pertenece a ${SITE_CONFIG.company}. Este es un programa independiente y no está afiliado, patrocinado ni autorizado por Canva Pty Ltd. Canva y sus elementos de marca pertenecen a sus respectivos propietarios.`,
        ],
      },
      {
        title: 'Tecnología',
        paragraphs: [
          'La plataforma fue desarrollada por W Studio con asistencia de OpenAI Codex. OpenAI no certifica, patrocina ni administra el curso.',
        ],
      },
      {
        title: 'Contacto',
        paragraphs: [
          `Las consultas pueden enviarse a ${SITE_CONFIG.supportEmail}.`,
        ],
      },
    ],
  },
  reembolsos: {
    eyebrow: 'Compras y garantía',
    title: 'Política de reembolsos',
    description:
      'Los pagos, solicitudes y devoluciones se administran mediante Hotmart.',
    sections: [
      {
        title: 'Plazo de garantía',
        paragraphs: [
          `La garantía vigente es de ${SITE_CONFIG.guaranteeDays} días. El plazo definitivo es el mostrado por Hotmart en el checkout y en la ficha oficial al momento de la compra.`,
        ],
      },
      {
        title: 'Cómo solicitarlo',
        bullets: [
          'Abre el correo de confirmación enviado por Hotmart.',
          'Accede al detalle de la compra o al Centro de Ayuda de Hotmart.',
          'Solicita el reembolso dentro del plazo mostrado en tu compra.',
          'Conserva el número de transacción para recibir asistencia.',
        ],
      },
      {
        title: 'Efecto sobre el acceso',
        paragraphs: [
          'Cuando Hotmart confirme un reembolso, contracargo, cancelación definitiva o vencimiento, el acceso al curso se revocará automáticamente.',
        ],
      },
      {
        title: 'Soporte',
        paragraphs: [
          `Si necesitas ayuda para localizar tu compra, escribe a ${SITE_CONFIG.supportEmail} desde el mismo correo utilizado en Hotmart.`,
        ],
      },
    ],
  },
};
