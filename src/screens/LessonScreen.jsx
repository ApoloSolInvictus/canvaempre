import {
  Check,
  ChevronLeft,
  Clock3,
  Headphones,
  Lock,
  Maximize2,
  MoreVertical,
  Share2,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import ActionSheet from '../components/ActionSheet';
import PrimaryButton from '../components/PrimaryButton';
import ProgressBar from '../components/ProgressBar';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import {
  getCourseForLesson,
  getLessonById,
  getLessonNavigation,
} from '../data/courses';
import {
  calculateCourseProgress,
  isCourseLocked,
} from '../services/progressService';
import { shareContent } from '../services/share';
import { fetchLessonContent } from '../services/protectedContent';

const LessonScreen = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, markLessonComplete } = useProgress();
  const [isCompleting, setIsCompleting] = useState(false);
  const [optimisticComplete, setOptimisticComplete] = useState(false);
  const [error, setError] = useState('');
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [visualOpen, setVisualOpen] = useState(false);
  const [lessonContent, setLessonContent] = useState(null);
  const [contentLoading, setContentLoading] = useState(true);
  const [contentError, setContentError] = useState('');
  const lesson = getLessonById(lessonId);
  const course = getCourseForLesson(lessonId);
  const completedLessons = profile?.completedLessons ?? [];
  const passedExams = profile?.passedExams ?? [];

  useEffect(() => {
    setOptimisticComplete(false);
    setError('');
    setVisualOpen(false);
  }, [lessonId]);

  useEffect(() => {
    if (!visualOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setVisualOpen(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [visualOpen]);

  useEffect(() => {
    let active = true;
    setLessonContent(null);
    setContentError('');
    setContentLoading(true);

    fetchLessonContent(user, lessonId)
      .then((content) => {
        if (active) setLessonContent(content);
      })
      .catch((currentError) => {
        if (active) {
          setContentError(
            currentError.message || 'No se pudo cargar la clase.',
          );
        }
      })
      .finally(() => {
        if (active) setContentLoading(false);
      });

    return () => {
      active = false;
    };
  }, [lessonId, user]);

  if (!lesson || !course) return <Navigate replace to="/app" />;

  const { previousLesson, nextLesson, lessonNumber } = getLessonNavigation(lesson.id);
  const completed = optimisticComplete || completedLessons.includes(lesson.id);
  const locked =
    isCourseLocked(course, completedLessons, passedExams) ||
    Boolean(
      !completed &&
        previousLesson &&
        !completedLessons.includes(previousLesson.id),
    );
  const progressLessons = completed
    ? [...new Set([...completedLessons, lesson.id])]
    : completedLessons;
  const progress = calculateCourseProgress(
    course,
    progressLessons,
    passedExams,
  );

  const handleComplete = async () => {
    if (completed || isCompleting) return;

    setIsCompleting(true);
    setOptimisticComplete(true);
    setError('');

    try {
      await markLessonComplete(lesson.id);
    } catch (currentError) {
      setOptimisticComplete(false);
      setError(currentError.message || 'No se pudo guardar el progreso.');
    } finally {
      setIsCompleting(false);
    }
  };

  const handlePrimaryAction = async () => {
    if (!completed) {
      await handleComplete();
      return;
    }

    if (nextLesson) {
      navigate(`/app/leccion/${nextLesson.id}`);
    } else {
      navigate(`/app/curso/${course.id}`);
    }
  };

  return (
    <div className="space-y-7 pb-8 pt-12">
      <header className="flex items-center justify-between px-8">
        <button
          aria-label="Volver"
          className="grid h-11 w-11 place-items-center rounded-full bg-white text-ink"
          type="button"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-8 w-8" strokeWidth={2.1} />
        </button>
        <p className="text-xl font-black text-ink">
          Lecci&oacute;n {lessonNumber} de {course.lessonsCount}
        </p>
        <button
          aria-label="Opciones"
          className="grid h-11 w-11 place-items-center rounded-full bg-white text-ink"
          type="button"
          onClick={() => setOptionsOpen(true)}
        >
          <MoreVertical className="h-7 w-7" strokeWidth={2.3} />
        </button>
      </header>

      <section className="px-8">
        <ProgressBar value={progress} />
      </section>

      <section className="space-y-5 px-8">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-violet">
          {lesson.moduleTitle}
        </p>
        <h1 className="text-[2.85rem] font-black leading-[1.05] text-ink">
          {lesson.title}
        </h1>
        <p className="flex items-center gap-3 text-2xl font-medium text-muted">
          <Clock3 className="h-7 w-7" strokeWidth={2.1} />
          {lesson.duration}
        </p>
        <figure>
          <button
            aria-label={`Ampliar ejemplo visual: ${lesson.title}`}
            className="group relative block aspect-[3/2] w-full overflow-hidden rounded-[1.35rem] bg-gray-100 shadow-[0_18px_52px_rgba(9,11,31,0.12)]"
            type="button"
            onClick={() => setVisualOpen(true)}
          >
            <img
              alt={`Ejemplo educativo de ${lesson.title} creado para W Studio`}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.01]"
              decoding="async"
              fetchpriority="high"
              height="1024"
              src={lesson.visualUrl}
              width="1536"
            />
            <span className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full bg-ink/85 px-3 py-2 text-xs font-black text-white shadow-lg backdrop-blur">
              <Maximize2 className="h-4 w-4" />
              Ampliar
            </span>
          </button>
          <figcaption className="mt-3 text-sm font-semibold leading-relaxed text-muted">
            Ejemplo visual W Studio aplicado al tema de esta clase.
          </figcaption>
        </figure>
      </section>

      {locked ? (
        <section className="mx-8 rounded-[1.35rem] bg-gray-100 p-5 text-center">
          <Lock className="mx-auto h-8 w-8 text-muted" />
          <h2 className="mt-3 text-lg font-black text-ink">Nivel bloqueado</h2>
          <p className="mt-2 text-sm font-semibold leading-relaxed text-muted">
            Completa el nivel anterior para desbloquear esta clase.
          </p>
          <PrimaryButton
            className="mt-4"
            variant="secondary"
            onClick={() => navigate(`/app/curso/${course.id}`)}
          >
            Volver al curso
          </PrimaryButton>
        </section>
      ) : contentLoading ? (
        <section className="px-8">
          <div className="grid min-h-48 place-items-center rounded-[1.35rem] bg-violet/5">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet/20 border-t-violet" />
          </div>
        </section>
      ) : contentError || !lessonContent ? (
        <section className="px-8">
          <div className="rounded-[1.35rem] bg-red-50 p-5 text-center">
            <p className="text-sm font-bold text-red-600">{contentError}</p>
            <PrimaryButton
              className="mt-4"
              variant="secondary"
              onClick={() => window.location.reload()}
            >
              Reintentar
            </PrimaryButton>
          </div>
        </section>
      ) : (
        <>
          <section className="px-8">
            <div className="rounded-[1.35rem] border border-gray-200 bg-white p-5">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-violet">
                Contenido de la clase
              </p>
              <p className="mt-4 text-lg font-medium leading-relaxed text-ink">
                {lessonContent.summary}
              </p>
            </div>
          </section>

          <section className="px-8">
            <div>
              <h2 className="text-2xl font-black text-ink">
                En esta lecci&oacute;n aprender&aacute;s a:
              </h2>
              <ul className="mt-6 space-y-5">
                {lessonContent.goals.map((goal) => (
                  <li key={goal} className="flex gap-4 text-xl font-medium leading-snug text-ink">
                    <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-violet text-white">
                      <Check className="h-5 w-5" strokeWidth={3} />
                    </span>
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="px-8">
            <div className="rounded-[1.35rem] bg-violet/5 p-5">
              <h2 className="text-2xl font-black text-ink">Paso a paso</h2>
              <ol className="mt-5 space-y-4">
                {lessonContent.steps.map((step, index) => (
                  <li key={step} className="flex gap-4 text-base font-medium leading-relaxed text-ink">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-sm font-black text-violet shadow-sm">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section className="grid gap-4 px-8">
            <div className="rounded-[1.35rem] border border-gray-200 bg-white p-5">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-violet">
                Práctica guiada
              </p>
              <p className="mt-3 text-base font-medium leading-relaxed text-ink">
                {lessonContent.practice}
              </p>
            </div>
            <div className="rounded-[1.35rem] border border-gray-200 bg-white p-5">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-violet">
                Tarea del módulo
              </p>
              <p className="mt-3 text-base font-medium leading-relaxed text-ink">
                {lessonContent.assignment}
              </p>
            </div>
          </section>

          {error && (
            <section className="px-8">
              <p className="rounded-[1.35rem] bg-red-50 p-4 text-sm font-bold text-red-600">
                {error}
              </p>
            </section>
          )}

          <section className="space-y-3 px-8">
            <PrimaryButton loading={isCompleting} onClick={handlePrimaryAction}>
              <Check className="h-7 w-7" strokeWidth={2.4} />
              {!completed
                ? 'Marcar como completada'
                : nextLesson
                  ? 'Siguiente clase'
                  : 'Curso terminado'}
            </PrimaryButton>
            <div className="grid grid-cols-2 gap-3">
              <PrimaryButton
                disabled={!previousLesson}
                variant="secondary"
                onClick={() => previousLesson && navigate(`/app/leccion/${previousLesson.id}`)}
              >
                Clase anterior
              </PrimaryButton>
              <PrimaryButton
                variant="secondary"
                onClick={() => navigate(`/app/curso/${course.id}`)}
              >
                Ver módulo
              </PrimaryButton>
            </div>
          </section>
        </>
      )}
      <ActionSheet
        description={lesson.title}
        open={optionsOpen}
        title="Opciones de la clase"
        onClose={() => setOptionsOpen(false)}
      >
        <button
          className="flex min-h-12 w-full items-center gap-3 rounded-2xl border border-gray-100 px-4 text-sm font-black text-ink"
          type="button"
          onClick={async () => {
            try {
              await shareContent({
                title: lesson.title,
                text: lessonContent?.summary || course.description,
                url: `${window.location.origin}/comprar`,
                contentType: 'lesson',
              });
            } finally {
              setOptionsOpen(false);
            }
          }}
        >
          <Share2 className="h-5 w-5 text-violet" />
          Compartir el curso
        </button>
        <button
          className="flex min-h-12 w-full items-center gap-3 rounded-2xl border border-gray-100 px-4 text-sm font-black text-ink"
          type="button"
          onClick={() => {
            setOptionsOpen(false);
            navigate(`/app/curso/${course.id}`);
          }}
        >
          <Clock3 className="h-5 w-5 text-violet" />
          Volver al módulo
        </button>
        <a
          className="flex min-h-12 w-full items-center gap-3 rounded-2xl border border-gray-100 px-4 text-sm font-black text-ink no-underline"
          href="mailto:info@wstudiocr.com?subject=Ayuda%20con%20una%20clase"
        >
          <Headphones className="h-5 w-5 text-violet" />
          Contactar soporte
        </a>
      </ActionSheet>
      {visualOpen && (
        <div
          aria-label={`Ejemplo ampliado: ${lesson.title}`}
          aria-modal="true"
          className="fixed inset-0 z-50 grid place-items-center bg-ink/95 p-3 sm:p-6"
          role="dialog"
        >
          <button
            aria-label="Cerrar imagen ampliada"
            className="absolute inset-0 cursor-zoom-out"
            type="button"
            onClick={() => setVisualOpen(false)}
          />
          <div className="relative z-10 w-full max-w-6xl">
            <button
              aria-label="Cerrar imagen ampliada"
              className="absolute right-3 top-3 z-20 grid h-11 w-11 place-items-center rounded-full bg-white text-ink shadow-lg"
              type="button"
              onClick={() => setVisualOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
            <img
              alt={`Ejemplo educativo ampliado de ${lesson.title}`}
              className="max-h-[calc(100vh-3rem)] w-full rounded-[1.35rem] bg-white object-contain shadow-2xl"
              height="1024"
              src={lesson.visualUrl}
              width="1536"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonScreen;
