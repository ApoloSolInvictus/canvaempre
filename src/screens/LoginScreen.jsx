import { Navigate, useSearchParams } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import MockupVisual from '../components/MockupVisual';
import { useAuth } from '../context/AuthContext';

const LoginScreen = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const initialMode =
    searchParams.get('mode') === 'register' ? 'register' : 'login';
  const requestedPath = searchParams.get('next');
  const successPath =
    requestedPath?.startsWith('/') && !requestedPath.startsWith('//')
      ? requestedPath
      : '/app';

  if (user) return <Navigate replace to={successPath} />;

  return (
    <div className="phone-shell min-h-screen overflow-hidden px-5 py-6">
      <div className="mb-6">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-black text-white shadow-soft">
          CE
        </div>
        <h1 className="mt-5 text-3xl font-black tracking-normal text-ink">
          {successPath === '/comprar'
            ? 'Prepara tu perfil'
            : 'Bienvenido de vuelta'}
        </h1>
        <p className="mt-2 text-sm font-semibold leading-relaxed text-muted">
          {successPath === '/comprar'
            ? 'Usaremos tu nombre para el progreso y el certificado. Después continuarás al pago seguro.'
            : 'Entra a tus clases, guarda avances y construye tu ruta de aprendizaje en Canva.'}
        </p>
      </div>
      <div className="mb-6">
        <MockupVisual variant="editor" />
      </div>
      <AuthForm initialMode={initialMode} successPath={successPath} />
    </div>
  );
};

export default LoginScreen;
