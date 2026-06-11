import { Check, ChevronLeft, Clock3, Lock, MoreVertical } from 'lucide-react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import MockupVisual from '../components/MockupVisual';
import PrimaryButton from '../components/PrimaryButton';
import ProgressBar from '../components/ProgressBar';
import { useProgress } from '../context/ProgressContext';
import { getCourseForLesson, getLessonById } from '../data/courses';
import {
  calculateCourseProgress,
  isCourseLocked,
} from '../services/progressService';

const LessonScreen = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { profile, markLessonComplete } = useProgress();
  const lesson = getLessonById(lessonId);
  const course = getCourseForLesson(lessonId);
  const completedLessons = profile?.completedLessons ?? [];

  if (!lesson || !course) return <Navigate replace to="/app" />;

  const locked = isCourseLocked(course, completedLessons);
  const completed = completedLessons.includes(lesson.id);
  const progress = calculateCourseProgress(course, completedLessons);
  const lessonNumber = course.lessons.findIndex((item) => item.id === lesson.id) + 1;

  const handleComplete = async () => {
    await markLessonComplete(lesson.id);
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
            <PrimaryButton disabled={completed} onClick={handleComplete}>
              <Check className="h-7 w-7" strokeWidth={2.4} />
              {completed ? 'Lecci&oacute;n completada' : 'Marcar como completada'}
            </PrimaryButton>
          </section>
        </>
      )}
    </div>
  );
};

export default LessonScreen;
