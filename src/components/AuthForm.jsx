import { useState } from 'react';
import { Chrome, Mail, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PrimaryButton from './PrimaryButton';

const AuthForm = ({ initialMode = 'login', successPath = '/app' }) => {
  const navigate = useNavigate();
  const { register, login, loginWithGoogle, loginAsDemo, isFirebaseConfigured } =
    useAuth();
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSuccess = () => navigate(successPath, { replace: true });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'register') {
        await register(form);
      } else {
        await login(form);
      }
      handleSuccess();
    } catch (currentError) {
      setError(currentError.message || 'No se pudo iniciar sesion.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError('');

    try {
      await loginWithGoogle();
      handleSuccess();
    } catch (currentError) {
      setError(currentError.message || 'No se pudo entrar con Google.');
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
          onClick={() => setMode('login')}
        >
          Login
        </button>
        <button
          className={`rounded-[1.25rem] px-4 py-3 text-sm font-bold transition ${
            mode === 'register' ? 'bg-white text-ink shadow-sm' : 'text-muted'
          }`}
          type="button"
          onClick={() => setMode('register')}
        >
          Registro
        </button>
      </div>

      {mode === 'register' && (
        <label className="flex min-h-[52px] items-center gap-3 rounded-3xl border border-gray-100 bg-white px-4 shadow-sm">
          <UserRound className="h-5 w-5 text-muted" />
          <input
            required
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
          className="w-full bg-transparent py-4 text-sm font-semibold text-ink outline-none placeholder:text-muted"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(event) => updateField('email', event.target.value)}
        />
      </label>

      <label className="flex min-h-[52px] items-center gap-3 rounded-3xl border border-gray-100 bg-white px-4 shadow-sm">
        <span className="grid h-5 w-5 place-items-center rounded-full bg-gray-300 text-[10px] font-black text-white">
          *
        </span>
        <input
          required
          className="w-full bg-transparent py-4 text-sm font-semibold text-ink outline-none placeholder:text-muted"
          minLength={6}
          placeholder="Contrasena"
          type="password"
          value={form.password}
          onChange={(event) => updateField('password', event.target.value)}
        />
      </label>

      {error && (
        <p className="rounded-3xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {error}
        </p>
      )}

      {!isFirebaseConfigured && (
        <p className="rounded-3xl bg-violet/10 px-4 py-3 text-xs font-semibold leading-relaxed text-violet">
          Firebase aun no esta configurado. Puedes probar la app en modo demo y
          luego agregar tus variables en .env.
        </p>
      )}

      <PrimaryButton loading={loading} type="submit">
        {mode === 'register' ? 'Crear cuenta' : 'Entrar'}
      </PrimaryButton>

      <PrimaryButton loading={loading} type="button" variant="secondary" onClick={handleGoogle}>
        <Chrome className="h-4 w-4" />
        Continuar con Google
      </PrimaryButton>

      {!isFirebaseConfigured && (
        <PrimaryButton loading={loading} type="button" variant="ghost" onClick={handleDemo}>
          Probar modo demo
        </PrimaryButton>
      )}
    </form>
  );
};

export default AuthForm;
