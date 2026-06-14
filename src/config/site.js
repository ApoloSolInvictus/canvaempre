export const SITE_CONFIG = {
  name: 'Canva para Emprender',
  company: 'W Studio',
  siteUrl: 'https://canvaempren.wstudio3d.com',
  companyUrl: 'https://wstudio3d.com/',
  supportEmail: 'info@wstudiocr.com',
  country: 'Costa Rica',
  legalUpdatedAt: '14 de junio de 2026',
  guaranteeDays: Number(import.meta.env.VITE_GUARANTEE_DAYS || 7),
};

export const SUPPORT_MAILTO = `mailto:${SITE_CONFIG.supportEmail}`;
