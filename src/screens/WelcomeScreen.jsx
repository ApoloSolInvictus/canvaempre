import { Link, useNavigate } from 'react-router-dom';
import { PencilLine, Sparkles } from 'lucide-react';
import PrimaryButton from '../components/PrimaryButton';
import PublicFooter from '../components/PublicFooter';

const WelcomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="phone-shell relative min-h-screen overflow-hidden bg-white">
      <div className="relative flex min-h-screen flex-col">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_42%_18%,rgba(55,208,223,0.18),transparent_19rem),radial-gradient(circle_at_78%_56%,rgba(109,53,255,0.22),transparent_23rem)]" />
        <div className="absolute -right-28 top-[39%] h-72 w-72 rounded-full bg-violet/18" />
        <div className="absolute -left-20 top-[53%] h-52 w-80 rounded-[55%] bg-cyan-200/35" />

      <section className="relative z-10 flex flex-1 flex-col items-center justify-center px-8 pb-36 pt-24 text-center">
        <div className="relative">
          <span className="canva-wordmark text-[4.9rem] leading-none">Canva</span>
          <Sparkles className="absolute -right-12 top-9 h-12 w-12 fill-violet text-violet" />
        </div>
        <h1 className="-mt-1 text-4xl font-black leading-tight text-ink">
          para Emprender
        </h1>
        <div className="soft-divider mt-8 h-0.5 w-56 rounded-full" />
        <p className="mt-7 text-lg font-medium text-ink">
          Dise&ntilde;a tu marca. Impulsa tu negocio.
        </p>
      </section>

        <section className="relative z-20 rounded-t-[3rem] bg-white px-8 pb-8 pt-0 text-center shadow-[0_-20px_60px_rgba(9,11,31,0.05)]">
        <div className="mx-auto -mt-8 grid h-16 w-16 place-items-center rounded-full border-2 border-white bg-violet/12 text-violet shadow-[0_14px_34px_rgba(109,53,255,0.16)]">
          <PencilLine className="h-8 w-8" strokeWidth={2.6} />
        </div>
        <h2 className="mx-auto mt-8 max-w-[18rem] text-2xl font-black leading-snug text-ink">
          Aprende Canva desde cero y lleva tus ideas al siguiente nivel.
        </h2>
        <p className="mx-auto mt-6 max-w-[19rem] text-lg font-medium leading-relaxed text-muted">
          Clases de 2 horas, pr&aacute;cticas y paso a paso para emprendedores como t&uacute;.
        </p>
        <div className="mt-8 flex justify-center gap-5">
          <span className="h-3 w-3 rounded-full bg-violet" />
          <span className="h-3 w-3 rounded-full bg-gray-200" />
          <span className="h-3 w-3 rounded-full bg-gray-200" />
        </div>
        <div className="mt-9 space-y-5">
          <PrimaryButton onClick={() => navigate('/comprar')}>
            Comprar el curso
          </PrimaryButton>
          <p className="text-center text-base font-medium text-ink">
            &iquest;Ya compraste?{' '}
            <Link className="font-semibold text-violet" to="/login">
              Inicia sesi&oacute;n
            </Link>
          </p>
        </div>
        </section>
      </div>
      <PublicFooter className="relative z-20 bg-white" />
    </div>
  );
};

export default WelcomeScreen;
