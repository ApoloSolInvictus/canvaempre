import {
  Award,
  BookOpenCheck,
  Check,
  ChevronLeft,
  ExternalLink,
  FileText,
  LockKeyhole,
  MonitorSmartphone,
  ShieldCheck,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import HotmartCheckoutButton, {
  HotmartCheckoutFallback,
} from '../components/HotmartCheckoutButton';
import PrimaryButton from '../components/PrimaryButton';
import { HOTMART_LINKS } from '../config/hotmart';
import { useAuth } from '../context/AuthContext';

const benefits = [
  {
    icon: BookOpenCheck,
    title: '40 clases prácticas',
    description: 'Cinco niveles para avanzar desde cero hasta presentar tu marca.',
  },
  {
    icon: FileText,
    title: 'Recursos aplicables',
    description: 'Guías, listas de revisión y ejercicios para tu propio negocio.',
  },
  {
    icon: Award,
    title: 'Certificado digital',
    description: 'Personalizado al completar el 100 % del programa.',
  },
];

const PurchaseScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="phone-shell min-h-screen overflow-hidden bg-white">
      <header className="flex items-center justify-between px-5 pb-4 pt-6">
        <button
          aria-label="Volver"
          className="grid h-11 w-11 place-items-center rounded-full border border-gray-100 bg-white text-ink shadow-sm"
          type="button"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <div className="flex items-center gap-2 text-xs font-bold text-muted">
          <LockKeyhole className="h-4 w-4 text-emerald-500" />
          Pago seguro
        </div>
      </header>

      <main className="pb-10">
        <section className="px-5">
          <div className="overflow-hidden rounded-[1.6rem] border border-gray-100 bg-[#f7f7fb]">
            <img
              alt="Canva para Emprender en computadora y teléfono"
              className="aspect-[1200/630] w-full object-cover"
              src="/og-canva-emprender.jpg"
            />
          </div>
          <p className="mt-6 text-sm font-black uppercase text-violet">
            Acceso completo
          </p>
          <h1 className="mt-2 text-[2.15rem] font-black leading-[1.08] text-ink">
            Convierte tus ideas en diseños que impulsen tu negocio.
          </h1>
          <p className="mt-4 text-base font-medium leading-relaxed text-muted">
            Aprende Canva paso a paso, crea una identidad visual coherente y
            prepara contenido profesional para toda Latinoamérica.
          </p>
        </section>

        <section className="mt-7 border-y border-gray-100 bg-[#fafaff] px-5 py-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-muted">Pago único</p>
              <p className="mt-1 text-4xl font-black text-ink">
                US$55
              </p>
            </div>
            <div className="rounded-full bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700">
              Acceso inmediato
            </div>
          </div>

          {user ? (
            <div className="mt-6">
              <div className="mb-4 flex items-start gap-3 rounded-2xl border border-violet/15 bg-white p-4">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-violet" />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-ink">Perfil preparado</p>
                  <p className="mt-1 break-words text-xs font-semibold leading-relaxed text-muted">
                    Compra con {user.email || 'el mismo correo de tu perfil'} para
                    vincular el acceso correctamente.
                  </p>
                </div>
              </div>
              <HotmartCheckoutButton />
              <div className="mt-3">
                <HotmartCheckoutFallback />
              </div>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              <PrimaryButton
                onClick={() => navigate('/login?mode=register&next=/comprar')}
              >
                Crear perfil y continuar
              </PrimaryButton>
              <PrimaryButton
                variant="secondary"
                onClick={() => navigate('/login?next=/comprar')}
              >
                Ya tengo una cuenta
              </PrimaryButton>
              <p className="px-2 text-center text-xs font-semibold leading-relaxed text-muted">
                Primero crearemos tu perfil para guardar el progreso y emitir tu
                certificado con el nombre correcto.
              </p>
            </div>
          )}

          <div className="mt-5 flex items-center justify-center gap-2 text-xs font-bold text-muted">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            Checkout procesado de forma segura por Hotmart
          </div>
        </section>

        <section className="space-y-5 px-5 py-7">
          <h2 className="text-xl font-black text-ink">Todo lo que recibes</h2>
          {benefits.map(({ icon: Icon, title, description }) => (
            <article className="flex gap-4" key={title}>
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-violet/10 text-violet">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-ink">{title}</h3>
                <p className="mt-1 text-sm font-medium leading-relaxed text-muted">
                  {description}
                </p>
              </div>
            </article>
          ))}
        </section>

        <section className="mx-5 rounded-[1.6rem] border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <MonitorSmartphone className="h-6 w-6 text-violet" />
            <h2 className="text-base font-black text-ink">
              Estudia desde cualquier dispositivo
            </h2>
          </div>
          <p className="mt-3 text-sm font-medium leading-relaxed text-muted">
            Avanza a tu ritmo desde el teléfono, la tableta o la computadora.
            Tu progreso queda guardado en el perfil.
          </p>
          <a
            className="mt-5 inline-flex items-center gap-2 text-sm font-black text-violet"
            href={HOTMART_LINKS.salesPage}
            rel="noreferrer"
            target="_blank"
          >
            Ver la página completa del curso
            <ExternalLink className="h-4 w-4" />
          </a>
        </section>

        <p className="mt-7 px-8 text-center text-xs font-semibold leading-relaxed text-muted">
          Al continuar aceptas las condiciones de compra y la garantía de 15 días
          administradas por Hotmart.
        </p>

        <div className="mt-5 text-center">
          <Link className="text-sm font-bold text-violet" to="/login">
            Volver al inicio de sesión
          </Link>
        </div>
      </main>
    </div>
  );
};

export default PurchaseScreen;
