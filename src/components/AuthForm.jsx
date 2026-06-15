import { useState } from 'react';
import { Chrome, Mail, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SITE_CONFIG } from '../config/site';
import PrimaryButton from './PrimaryButton';

const authErrorMessages = {
  'auth/account-exists-with-different-credential':
    'Ese correo ya tiene una cuenta con otro método de acceso.',
  'auth/email-already-in-use':
    'Ese correo ya tiene una cuenta. Prueba iniciar sesión.',
  'auth/internal-error':
    'Google no pudo abrirse correctamente. Recarga la página e inténtalo de nuevo.',
  'auth/invalid-credential':
    'El correo o la contraseña no son correctos.',
  'auth/invalid-email': 'Escribe un correo válido.',
  'auth/popup-blocked':
    'El navegador bloqueó la ventana de Google. Permite ventanas emergentes e inténtalo nuevamente.',
  'auth/popup-closed-by-user':
    'La ventana de Google se cerró antes de completar el acceso.',
  'auth/too-many-requests':
    'Hay demasiados intentos. Espera unos minutos.',
  'auth/unauthorized-domain':
    'Este dominio todavía no está autorizado para iniciar sesión con Google.',
  'auth/weak-password': 'La contraseña necesita al menos 6 caracteres.',
};

const getAuthErrorMessage = (error, fallback) =>
  authErrorMessages[error?.code] || fallback;

const AuthForm = ({ initialMode = 'login', successPath = '/app' }) => {
  const navigate = useNavigate();
  const {
    register,
    login,
    loginWithGoogle,
    loginAsDemo,
    requestPasswordReset,
    isFirebaseConfigured,
  } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [resetMode, setResetMode] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSuccess = () => navigate(successPath, { replace: true });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (resetMode) {
        await requestPasswordReset(form.email);
        setMessage(
          'Si existe una cuenta con ese correo, Firebase enviará un enlace para crear una nueva contraseña.',
        );
        return;
      }
      if (mode === 'register') {
        await register(form);
      } else {
        await login(form);
      }
      handleSuccess();
    } catch (currentError) {
      setError(
        getAuthErrorMessage(
          currentError,
          'No se pudo completar la solicitud. Inténtalo nuevamente.',
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await loginWithGoogle();
      handleSuccess();
    } catch (currentError) {
      setError(
        getAuthErrorMessage(
          currentError,
          'No se pudo entrar con Google. Inténtalo nuevamente.',
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setLoading(true);
    setError('');

    try {
      await loginAsDemo();
      handleSuccess();
    } catch (currentError) {
      setError(currentError.message || 'No se pudo iniciar el demo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 rounded-3xl bg-gray-100 p-1">
        <button
          className={`rounded-[1.25rem] px-4 py-3 text-sm font-bold transition ${
            mode === 'login' ? 'bg-white text-ink shadow-sm' : 'text-muted'
          }`}
          type="button"
          onClick={() => {
            setMode('login');
            setResetMode(false);
            setError('');
            setMessage('');
          }}
        >
          Login
        </button>
        <button
          className={`rounded-[1.25rem] px-4 py-3 text-sm font-bold transition ${
            mode === 'register' ? 'bg-white text-ink shadow-sm' : 'text-muted'
          }`}
          type="button"
          onClick={() => {
            setMode('register');
            setResetMode(false);
            setError('');
            setMessage('');
          }}
        >
          Registro
        </button>
      </div>

      {mode === 'register' && !resetMode && (
        <label className="flex min-h-[52px] items-center gap-3 rounded-3xl border border-gray-100 bg-white px-4 shadow-sm">
          <UserRound className="h-5 w-5 text-muted" />
          <input
            required
            autoComplete="name"
            className="w-full bg-transparent py-4 text-sm font-semibold text-ink outline-none placeholder:text-muted"
            placeholder="Nombre del estudiante"
            value={form.name}
            onChange={(event) => updateField('name', event.target.value)}
          />
        </label>
      )}

      <label className="flex min-h-[52px] items-center gap-3 rounded-3xl border border-gray-100 bg-white px-4 shadow-sm">
        <Mail className="h-5 w-5 text-muted" />
        <input
          required
          autoComplete="email"
          className="w-full bg-transparent py-4 text-sm font-semibold text-ink outline-none placeholder:text-muted"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(event) => updateField('email', event.target.value)}
        />
      </label>

      {!resetMode && (
        <label className="flex min-h-[52px] items-center gap-3 rounded-3xl border border-gray-100 bg-white px-4 shadow-sm">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-gray-300 text-[10px] font-black text-white">
            *
          </span>
          <input
            required
            autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
            className="w-full bg-transparent py-4 text-sm font-semibold text-ink outline-none placeholder:text-muted"
            minLength={6}
            placeholder="Contraseña"
            type="password"
            value={form.password}
            onChange={(event) => updateField('password', event.target.value)}
          />
        </label>
      )}

      {mode === 'login' && (
        <button
          className="w-full text-right text-xs font-black text-violet"
          type="button"
          onClick={() => {
            setResetMode((current) => !current);
            setError('');
            setMessage('');
          }}
        >
          {resetMode ? 'Volver al inicio de sesión' : '¿Olvidaste tu contraseña?'}
        </button>
      )}

      {error && (
        <p className="rounded-3xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {error}
        </p>
      )}
      {message && (
        <p className="rounded-3xl bg-emerald-50 px-4 py-3 text-sm font-semibold leading-relaxed text-emerald-700">
          {message}
        </p>
      )}

      {!isFirebaseConfigured && (
        <p className="rounded-3xl bg-violet/10 px-4 py-3 text-xs font-semibold leading-relaxed text-violet">
          Firebase aun no esta configurado. Puedes probar la app en modo demo y
          luego agregar tus variables en .env.
        </p>
      )}

      <PrimaryButton loading={loading} type="submit">
        {resetMode
          ? 'Enviar enlace'
          : mode === 'register'
            ? 'Crear cuenta'
            : 'Entrar'}
      </PrimaryButton>

      {!resetMode && (
        <PrimaryButton
          loading={loading}
          type="button"
          variant="secondary"
          onClick={handleGoogle}
        >
          <Chrome className="h-4 w-4" />
          Continuar con Google
        </PrimaryButton>
      )}

      {!isFirebaseConfigured && (
        <PrimaryButton loading={loading} type="button" variant="ghost" onClick={handleDemo}>
          Probar modo demo
        </PrimaryButton>
      )}
      <p className="text-center text-xs font-semibold leading-relaxed text-muted">
        ¿Necesitas ayuda?{' '}
        <a
          className="font-black text-violet"
          href={`mailto:${SITE_CONFIG.supportEmail}`}
        >
          {SITE_CONFIG.supportEmail}
        </a>
      </p>
    </form>
  );
};

export default AuthForm;
