import {
  CheckCircle2,
  LogOut,
  Mail,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import HotmartCheckoutButton, {
  HotmartCheckoutFallback,
} from '../components/HotmartCheckoutButton';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';

const PaymentRequiredScreen = () => {
  const { logout } = useAuth();
  const { profile, refreshProfile } = useProgress();
  const revoked = profile?.accessStatus === 'revoked';

  return (
    <div className="min-h-screen bg-white px-5 pb-10 pt-8">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-[1.4rem] bg-violet/10 text-violet">
        <ShieldCheck className="h-8 w-8" />
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs font-black uppercase text-violet">
          {revoked ? 'Acceso suspendido' : 'Completa tu inscripción'}
        </p>
        <h1 className="mt-3 text-3xl font-black leading-tight text-ink">
          {revoked
            ? 'Necesitamos revisar el estado de tu compra.'
            : 'Un solo pago abre todo el programa.'}
        </h1>
        <p className="mt-4 text-sm font-medium leading-relaxed text-muted">
          {revoked
            ? 'El acceso fue actualizado después de un reembolso o contracargo. Revisa tu correo de Hotmart antes de continuar.'
            : 'Obtén las 40 clases, recursos prácticos, seguimiento de progreso y certificado digital.'}
        </p>
      </div>

      {!revoked && (
        <section className="mt-7 rounded-[1.6rem] border border-gray-100 bg-[#fafaff] p-5">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-bold text-muted">Pago único</p>
              <p className="mt-1 text-4xl font-black text-ink">US$55</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700">
              7 días de garantía
            </span>
          </div>
          <div className="mt-5">
            <HotmartCheckoutButton />
          </div>
          <div className="mt-3">
            <HotmartCheckoutFallback />
          </div>
        </section>
      )}

      <section className="mt-6 space-y-3 rounded-[1.6rem] border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <Mail className="mt-0.5 h-5 w-5 shrink-0 text-violet" />
          <div>
            <p className="text-sm font-black text-ink">Usa el mismo correo</p>
            <p className="mt-1 break-words text-xs font-semibold leading-relaxed text-muted">
              Compra con {profile?.email || 'el correo de tu perfil'} para
              relacionar la confirmación de Hotmart con esta cuenta.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
          <p className="text-xs font-semibold leading-relaxed text-muted">
            Si ya pagaste, espera el correo de aprobación y luego actualiza tu
            acceso.
          </p>
        </div>
      </section>

      <div className="mt-6 space-y-3">
        <PrimaryButton variant="secondary" onClick={refreshProfile}>
          <RefreshCw className="h-5 w-5" />
          Ya pagué: actualizar acceso
        </PrimaryButton>
        <PrimaryButton variant="ghost" onClick={logout}>
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </PrimaryButton>
      </div>
    </div>
  );
};

export default PaymentRequiredScreen;

