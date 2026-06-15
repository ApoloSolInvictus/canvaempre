import {
  Award,
  BookCheck,
  FileBadge2,
  Headphones,
  LogOut,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import PrimaryButton from '../components/PrimaryButton';
import ProgressBar from '../components/ProgressBar';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';

const ProfileScreen = () => {
  const navigate = useNavigate();
  const { logout, isFirebaseConfigured } = useAuth();
  const { profile, stats } = useProgress();
  const certificateReady = Boolean(profile?.certificateNumber);

  return (
    <div className="space-y-5">
      <Header subtitle="Tu avance y certificaciones" title="Perfil" />

      <section className="mx-5 rounded-[2rem] bg-gradient-to-br from-indigo-600 to-violet-600 p-5 text-white shadow-soft">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-3xl bg-white/15">
            <UserRound className="h-8 w-8" />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-2xl font-black">
              {profile?.name ?? 'Emprendedor'}
            </h2>
            {profile?.role === 'admin' && (
              <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-bold text-white">
                <ShieldCheck className="h-3.5 w-3.5" />
                Administrador W Studio
              </p>
            )}
            <p className="mt-1 text-sm font-semibold text-white/75">
              Nivel actual {stats.currentLevel}
            </p>
          </div>
        </div>
        <div className="mt-6 rounded-3xl bg-white/15 p-4">
          <ProgressBar label="Progreso total" value={stats.totalProgress} />
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 px-5">
        <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
          <Award className="h-6 w-6 text-violet" />
          <p className="mt-4 text-2xl font-black text-ink">
            {stats.certificatesUnlocked}
          </p>
          <p className="text-xs font-bold text-muted">Certificados</p>
        </div>
        <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
          <BookCheck className="h-6 w-6 text-emerald-500" />
          <p className="mt-4 text-2xl font-black text-ink">
            {stats.completedClasses}
          </p>
          <p className="text-xs font-bold text-muted">Clases completadas</p>
        </div>
      </section>

      <section className="space-y-3 px-5">
        <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-violet/10 text-violet">
              <FileBadge2 className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-ink">
                Certificado Digital W Studio
              </p>
              <p className="text-xs font-semibold text-muted">
                {certificateReady
                  ? 'Disponible para guardar como PDF'
                  : stats.totalProgress === 100
                    ? 'Completado: certificado en emisión'
                    : `Pendiente: ${stats.totalProgress}% completado`}
              </p>
            </div>
          </div>
          <PrimaryButton
            className="mt-4"
            variant={certificateReady ? 'primary' : 'secondary'}
            onClick={() => navigate('/app/certificado')}
          >
            <FileBadge2 className="h-5 w-5" />
            {certificateReady
              ? 'Ver certificado'
              : stats.totalProgress === 100
                ? 'Revisar emisión'
                : 'Ver progreso del certificado'}
          </PrimaryButton>
        </div>
        <div className="flex items-center gap-3 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
          <ShieldCheck className="h-5 w-5 text-violet" />
          <div>
            <p className="text-sm font-bold text-ink">Estado de datos</p>
            <p className="text-xs font-semibold text-muted">
              {isFirebaseConfigured
                ? 'Firebase Authentication y Firestore activos'
                : 'Modo demo local activo'}
            </p>
          </div>
        </div>
        <PrimaryButton variant="secondary" onClick={logout}>
          <LogOut className="h-4 w-4" />
          Cerrar sesion
        </PrimaryButton>
        <PrimaryButton
          variant="ghost"
          onClick={() => navigate('/soporte')}
        >
          <Headphones className="h-4 w-4" />
          Soporte y ayuda
        </PrimaryButton>
      </section>
    </div>
  );
};

export default ProfileScreen;
