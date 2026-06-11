import { Check, ChevronLeft, Clock3, Lock, MoreVertical } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import MockupVisual from '../components/MockupVisual';
import PrimaryButton from '../components/PrimaryButton';
import ProgressBar from '../components/ProgressBar';
import { useProgress } from '../context/ProgressContext';
import {
  getCourseForLesson,
  getLessonById,
  getLessonNavigation,
} from '../data/courses';
import {
  calculateCourseProgress,
  isCourseLocked,
} from '../services/progressService';

const LessonScreen = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { profile, markLessonComplete } = useProgress();
  const [isCompleting, setIsCompleting] = useState(false);
  const [optimisticComplete, setOptimisticComplete] = useState(false);
  const [error, setError] = useState('');
  const lesson = getLessonById(lessonId);
  const course = getCourseForLesson(lessonId);
  const completedLessons = profile?.completedLessons ?? [];

  useEffect(() => {
    setOptimisticComplete(false);
    setError('');
  }, [lessonId]);

  if (!lesson || !course) return <Navigate replace to="/app" />;

  const { previousLesson, nextLesson, lessonNumber } = getLessonNavigation(lesson.id);
  const completed = optimisticComplete || completedLessons.includes(lesson.id);
  const locked =
    isCourseLocked(course, completedLessons) ||
    Boolean(
      !completed &&
        previousLesson &&
        !completedLessons.includes(previousLesson.id),
    );
  const progressLessons = completed
    ? [...new Set([...completedLessons, lesson.id])]
    : completedLessons;
  const progress = calculateCourseProgress(course, progressLessons);

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
        <MockupVisual gradient={course.gradient} variant="editor" />
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
      ) : (
        <>
          <section className="px-8">
            <div className="rounded-[1.35rem] border border-gray-200 bg-white p-5">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-violet">
                Contenido de la clase
              </p>
              <p className="mt-4 text-lg font-medium leading-relaxed text-ink">
                {lesson.summary}
              </p>
            </div>
          </section>

          <section className="px-8">
            <div>
              <h2 className="text-2xl font-black text-ink">
                En esta lecci&oacute;n aprender&aacute;s a:
              </h2>
              <ul className="mt-6 space-y-5">
                {lesson.goals.map((goal) => (
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
                {lesson.steps.map((step, index) => (
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
                {lesson.practice}
              </p>
            </div>
            <div className="rounded-[1.35rem] border border-gray-200 bg-white p-5">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-violet">
                Tarea del módulo
              </p>
              <p className="mt-3 text-base font-medium leading-relaxed text-ink">
                {lesson.assignment}
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
    </div>
  );
};

export default LessonScreen;
