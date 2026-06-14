import {
  CheckCircle2,
  Clock3,
  MailCheck,
  RefreshCw,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { trackApprovedPurchase } from '../services/analytics';

const statusConfig = {
  approved: {
    icon: CheckCircle2,
    iconClass: 'bg-emerald-50 text-emerald-600',
    eyebrow: 'Compra aprobada',
    title: 'Tu camino creativo comienza ahora.',
    description:
      'Hotmart aprobó el pago. Entra con el mismo correo utilizado durante la compra para acceder a tu perfil y continuar.',
    action: 'Entrar a mis clases',
  },
  pending: {
    icon: Clock3,
    iconClass: 'bg-amber-50 text-amber-600',
    eyebrow: 'Pago en proceso',
    title: 'Estamos esperando la confirmación.',
    description:
      'Algunos métodos de pago tardan un poco más. Hotmart te enviará un correo cuando la operación quede aprobada.',
    action: 'Revisar mi perfil',
  },
};

const PurchaseStatusScreen = ({ status = 'approved' }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const config = statusConfig[status] ?? statusConfig.pending;
  const Icon = config.icon;

  const destination = user ? '/app' : '/login';

  useEffect(() => {
    if (status === 'approved') trackApprovedPurchase();
  }, [status]);

  return (
    <div className="phone-shell flex min-h-screen flex-col bg-white px-7 py-10">
      <div className="flex flex-1 flex-col justify-center">
        <div
          className={`grid h-20 w-20 place-items-center rounded-[1.7rem] ${config.iconClass}`}
        >
          <Icon className="h-10 w-10" />
        </div>
        <p className="mt-8 text-sm font-black uppercase text-violet">
          {config.eyebrow}
        </p>
        <h1 className="mt-3 text-4xl font-black leading-tight text-ink">
          {config.title}
        </h1>
        <p className="mt-5 text-base font-medium leading-relaxed text-muted">
          {config.description}
        </p>

        <div className="mt-7 rounded-[1.5rem] border border-gray-100 bg-[#fafaff] p-5">
          <div className="flex items-start gap-3">
            <MailCheck className="mt-0.5 h-5 w-5 shrink-0 text-violet" />
            <p className="text-sm font-semibold leading-relaxed text-muted">
              Usa en la app el mismo correo de la compra. Así podremos asociar la
              confirmación de Hotmart con tu acceso y certificado.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <PrimaryButton onClick={() => navigate(destination)}>
          {status === 'pending' && <RefreshCw className="h-5 w-5" />}
          {config.action}
        </PrimaryButton>
        <PrimaryButton variant="secondary" onClick={() => navigate('/')}>
          Volver al inicio
        </PrimaryButton>
      </div>
    </div>
  );
};

export default PurchaseStatusScreen;
