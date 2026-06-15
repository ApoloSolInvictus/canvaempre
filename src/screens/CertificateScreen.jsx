import {
  Award,
  CalendarDays,
  ChevronLeft,
  Download,
  FileBadge2,
  Hash,
  ShieldCheck,
  ScanSearch,
} from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from '../components/PrimaryButton';
import ProgressBar from '../components/ProgressBar';
import { useProgress } from '../context/ProgressContext';
import { getCertificateDisplayDate } from '../services/progressService';

const W_STUDIO_LOGO = '/w-studio-logo.png';

const CertificateScreen = () => {
  const navigate = useNavigate();
  const { profile, stats, refreshProfile } = useProgress();
  const isApproved = Boolean(profile?.certificateNumber);
  const studentName = profile?.name || 'Emprendedor';
  const approvedDate = getCertificateDisplayDate(profile);
  const certificateNumber = profile?.certificateNumber || 'WST-CPE-PENDIENTE';

  useEffect(() => {
    if (stats.totalProgress === 100 && !profile?.certificateNumber) {
      refreshProfile();
    }
  }, [
    profile?.certificateNumber,
    refreshProfile,
    stats.totalProgress,
  ]);

  if (!isApproved) {
    return (
      <div className="space-y-7 px-8 pb-10 pt-12">
        <header className="flex items-center gap-4">
          <button
            aria-label="Volver"
            className="grid h-11 w-11 place-items-center rounded-full bg-white text-ink"
            type="button"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-8 w-8" strokeWidth={2.1} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-ink">Certificado</h1>
            <p className="text-sm font-semibold text-muted">Aún no está desbloqueado</p>
          </div>
        </header>

        <section className="rounded-[2rem] border border-gray-200 bg-white p-6 text-center shadow-[0_18px_50px_rgba(9,11,31,0.06)]">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-violet/10 text-violet">
            <FileBadge2 className="h-8 w-8" />
          </div>
          <h2 className="mt-5 text-2xl font-black text-ink">Certificado pendiente</h2>
          <p className="mt-3 text-sm font-semibold leading-relaxed text-muted">
            {stats.totalProgress === 100
              ? 'Completaste el programa. Estamos verificando y emitiendo tu certificado en el servidor.'
              : 'Completa las 40 clases y aprueba los 5 exámenes para emitir tu certificado digital de W Studio.'}
          </p>
          <div className="mt-6">
            <ProgressBar label="Progreso del curso" value={stats.totalProgress} />
          </div>
          <PrimaryButton
            className="mt-6"
            onClick={() =>
              stats.totalProgress === 100
                ? refreshProfile()
                : navigate('/app')
            }
          >
            {stats.totalProgress === 100
              ? 'Revisar emisión'
              : 'Continuar aprendiendo'}
          </PrimaryButton>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-5 px-5 pb-10 pt-8">
      <header className="certificate-actions flex items-center justify-between px-3">
        <button
          aria-label="Volver"
          className="grid h-11 w-11 place-items-center rounded-full bg-white text-ink"
          type="button"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-8 w-8" strokeWidth={2.1} />
        </button>
        <button
          aria-label="Verificar certificado"
          className="grid h-11 w-11 place-items-center rounded-full bg-white text-violet"
          type="button"
          onClick={() =>
            navigate(
              `/verificar-certificado?numero=${encodeURIComponent(
                certificateNumber,
              )}`,
            )
          }
        >
          <ScanSearch className="h-5 w-5" />
        </button>
        <button
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-4 text-sm font-black text-white"
          type="button"
          onClick={() => window.print()}
        >
          <Download className="h-4 w-4" />
          Guardar PDF
        </button>
      </header>

      <article className="certificate-paper relative overflow-hidden rounded-[2rem] border border-gray-200 bg-white px-6 py-7 text-center shadow-[0_22px_70px_rgba(9,11,31,0.1)]">
        <div className="absolute -left-28 top-16 h-56 w-56 rounded-full bg-cyan-200/20" />
        <div className="absolute -right-28 bottom-24 h-64 w-64 rounded-full bg-violet/12" />
        <div className="absolute inset-x-6 top-5 h-1 rounded-full bg-gradient-to-r from-red-500 via-yellow-300 via-lime-400 to-blue-600" />

        <div className="relative z-10">
          <img
            alt="W Studio"
            className="mx-auto h-20 w-20 object-contain"
            src={W_STUDIO_LOGO}
          />
          <p className="mt-4 text-xs font-black uppercase tracking-[0.24em] text-violet">
            W Studio
          </p>
          <h1 className="mt-2 text-[2.45rem] font-black leading-none text-ink">
            Certificado Digital
          </h1>
          <div className="mx-auto mt-4 h-0.5 w-40 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600" />

          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-muted">
            Otorga el presente certificado a
          </p>
          <h2 className="mt-3 break-words text-[2.25rem] font-black leading-tight text-ink">
            {studentName}
          </h2>

          <p className="mx-auto mt-6 max-w-[21rem] text-base font-semibold leading-relaxed text-muted">
            Por haber aprobado y completado satisfactoriamente el curso de
          </p>
          <p className="mx-auto mt-3 max-w-[20rem] text-2xl font-black leading-tight text-violet">
            Canva para Emprendedores
          </p>

          <div className="mt-7 grid gap-3 rounded-[1.5rem] border border-gray-200 bg-gray-50/80 p-4 text-left">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-violet">
                <CalendarDays className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-muted">
                  Fecha de aprobado
                </p>
                <p className="text-sm font-black text-ink">{approvedDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-violet">
                <Hash className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-muted">
                  Número de certificado
                </p>
                <p className="break-all text-sm font-black text-ink">
                  {certificateNumber}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-9 grid gap-7">
            <div>
              <p className="font-serif text-4xl italic leading-none text-ink">
                Ronny Woods
              </p>
              <div className="mx-auto mt-3 h-px w-52 bg-gray-300" />
              <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-muted">
                Aprobado por:
              </p>
              <p className="text-sm font-black text-ink">
                Ronny Woods - CEO de W Studio
              </p>
            </div>

            <div>
              <p className="font-serif text-4xl italic leading-none text-ink">
                OpenAI Codex
              </p>
              <div className="mx-auto mt-3 h-px w-52 bg-gray-300" />
              <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-muted">
                Desarrollado con asistencia de:
              </p>
              <p className="text-sm font-black text-ink">OpenAI Codex</p>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 rounded-full bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-600">
            <ShieldCheck className="h-5 w-5" />
            Aprobado y completado
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 text-xs font-bold text-muted">
            <Award className="h-4 w-4 text-violet" />
            Certificación digital emitida por W Studio
          </div>
        </div>
      </article>
    </div>
  );
};

export default CertificateScreen;
