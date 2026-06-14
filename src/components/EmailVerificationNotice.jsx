import {
  CheckCircle2,
  LogOut,
  MailCheck,
  RefreshCw,
  Send,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import PrimaryButton from './PrimaryButton';

const EmailVerificationNotice = ({ compact = false }) => {
  const {
    user,
    logout,
    refreshUser,
    sendVerificationEmail,
    requiresEmailVerification,
  } = useAuth();
  const [loadingAction, setLoadingAction] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (!requiresEmailVerification) return null;

  const runAction = async (action, callback, successMessage) => {
    setLoadingAction(action);
    setMessage('');
    setError('');
    try {
      const result = await callback();
      if (action === 'refresh' && result?.emailVerified) {
        setMessage('Correo verificado. Ya puedes continuar.');
      } else {
        setMessage(successMessage);
      }
    } catch (currentError) {
      setError(
        currentError.code === 'auth/too-many-requests'
          ? 'Espera unos minutos antes de volver a intentarlo.'
          : 'No se pudo completar la acción. Inténtalo nuevamente.',
      );
    } finally {
      setLoadingAction('');
    }
  };

  return (
    <section
      className={
        compact
          ? 'rounded-3xl border border-amber-200 bg-amber-50 p-5'
          : 'min-h-screen bg-white px-6 pb-10 pt-14'
      }
    >
      <div className={compact ? '' : 'mx-auto max-w-sm text-center'}>
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-amber-100 text-amber-700">
          <MailCheck className="h-8 w-8" />
        </span>
        <p className="mt-5 text-xs font-black uppercase text-amber-700">
          Verifica tu correo
        </p>
        <h1 className="mt-2 text-2xl font-black leading-tight text-ink">
          Confirma que {user?.email} te pertenece.
        </h1>
        <p className="mt-3 text-sm font-semibold leading-relaxed text-muted">
          Te enviamos un enlace de Firebase. Esta verificación protege tu compra,
          progreso y certificado.
        </p>

        {message && (
          <p className="mt-4 flex items-start gap-2 rounded-2xl bg-emerald-50 p-3 text-left text-xs font-bold text-emerald-700">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {message}
          </p>
        )}
        {error && (
          <p className="mt-4 rounded-2xl bg-red-50 p-3 text-xs font-bold text-red-700">
            {error}
          </p>
        )}

        <div className="mt-5 space-y-3">
          <PrimaryButton
            loading={loadingAction === 'refresh'}
            onClick={() =>
              runAction(
                'refresh',
                refreshUser,
                'Aún no aparece verificado. Abre el enlace del correo y vuelve a revisar.',
              )
            }
          >
            <RefreshCw className="h-5 w-5" />
            Ya verifiqué: revisar
          </PrimaryButton>
          <PrimaryButton
            loading={loadingAction === 'send'}
            variant="secondary"
            onClick={() =>
              runAction(
                'send',
                sendVerificationEmail,
                'Enviamos un nuevo correo de verificación.',
              )
            }
          >
            <Send className="h-5 w-5" />
            Reenviar correo
          </PrimaryButton>
          {!compact && (
            <PrimaryButton variant="ghost" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Usar otra cuenta
            </PrimaryButton>
          )}
        </div>
      </div>
    </section>
  );
};

export default EmailVerificationNotice;
