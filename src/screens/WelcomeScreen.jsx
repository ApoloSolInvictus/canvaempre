import { Link, useNavigate } from 'react-router-dom';
import MockupVisual from '../components/MockupVisual';
import PrimaryButton from '../components/PrimaryButton';

const WelcomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="phone-shell flex min-h-screen flex-col overflow-hidden px-5 py-6">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-black text-white shadow-soft">
          CE
        </div>
        <div>
          <p className="text-sm font-black text-ink">Canva para Emprender</p>
          <p className="text-xs font-semibold text-muted">
            Disena tu marca. Impulsa tu negocio.
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-center gap-7 py-6">
        <MockupVisual />
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-violet">
            Clases virtuales de 2 horas
          </p>
          <h1 className="mt-3 text-5xl font-black leading-[0.95] tracking-normal text-ink">
            Canva para Emprender
          </h1>
          <p className="mt-5 text-lg font-semibold leading-relaxed text-muted">
            Aprende Canva desde cero y lleva tus ideas al siguiente nivel.
          </p>
        </div>
      </div>

      <div className="space-y-4 pb-2">
        <PrimaryButton onClick={() => navigate('/login')}>Comenzar</PrimaryButton>
        <p className="text-center text-sm font-semibold text-muted">
          Ya tienes cuenta?{' '}
          <Link className="text-violet" to="/login">
            Inicia sesion
          </Link>
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
