import { ExternalLink, Mail, ReceiptText, ShieldCheck } from 'lucide-react';
import PublicPageLayout from '../components/PublicPageLayout';
import { SITE_CONFIG, SUPPORT_MAILTO } from '../config/site';
import { HOTMART_LINKS } from '../config/hotmart';
import { trackEvent } from '../services/analytics';

const SupportScreen = () => (
  <PublicPageLayout
    description="Estamos para ayudarte con acceso, compra, progreso o certificado."
    eyebrow="Ayuda"
    title="Soporte de W Studio"
  >
    <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
      <Mail className="h-7 w-7 text-violet" />
      <h2 className="mt-4 text-xl font-black text-ink">Escríbenos</h2>
      <p className="mt-2 text-sm font-medium leading-relaxed text-muted">
        Incluye el correo de tu perfil y, si es una compra, el número de
        transacción de Hotmart.
      </p>
      <a
        className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-violet px-4 text-sm font-black text-white"
        href={`${SUPPORT_MAILTO}?subject=Soporte%20Canva%20para%20Emprender`}
        onClick={() => trackEvent('support_contact', { method: 'email' })}
      >
        {SITE_CONFIG.supportEmail}
      </a>
    </section>

    <section className="space-y-4">
      <div className="flex gap-3">
        <ReceiptText className="mt-0.5 h-6 w-6 shrink-0 text-violet" />
        <div>
          <h2 className="text-base font-black text-ink">Problemas de pago</h2>
          <p className="mt-1 text-sm font-medium leading-relaxed text-muted">
            Hotmart procesa tarjetas, PayPal, reembolsos y comprobantes.
          </p>
        </div>
      </div>
      <a
        className="inline-flex items-center gap-2 text-sm font-black text-violet"
        href={HOTMART_LINKS.productPage}
        rel="noreferrer"
        target="_blank"
      >
        Ver compra en Hotmart
        <ExternalLink className="h-4 w-4" />
      </a>
    </section>

    <section className="flex gap-3 rounded-3xl bg-emerald-50 p-5">
      <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />
      <p className="text-sm font-semibold leading-relaxed text-emerald-800">
        Nunca envíes contraseñas, números completos de tarjeta ni claves
        privadas. W Studio no solicita esos datos por correo.
      </p>
    </section>
  </PublicPageLayout>
);

export default SupportScreen;

