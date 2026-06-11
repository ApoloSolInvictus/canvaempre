import { CheckCircle2, Lock, PlayCircle } from 'lucide-react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
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

  const handleComplete = async () => {
    await markLessonComplete(lesson.id);
  };

  return (
    <div className="space-y-5">
      <Header
        showBack
        subtitle={`${course.title} | ${lesson.duration}`}
        title={lesson.title}
      />

      <section className="space-y-4 px-5">
        <ProgressBar label="Progreso del nivel" value={progress} />
        <MockupVisual gradient={course.gradient} variant="editor" />
      </section>

      {locked ? (
        <section className="mx-5 rounded-3xl bg-gray-100 p-5 text-center">
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
          <section className="px-5">
            <div className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet">
                En esta leccion aprenderas
              </p>
              <ul className="mt-4 space-y-3">
                {lesson.goals.map((goal) => (
                  <li key={goal} className="flex gap-3 text-sm font-semibold leading-relaxed text-ink">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="space-y-4 px-5">
            <div className="rounded-3xl bg-violet/10 p-4">
              <div className="flex items-start gap-3">
                <PlayCircle className="mt-0.5 h-5 w-5 shrink-0 text-violet" />
                <p className="text-sm font-semibold leading-relaxed text-ink">
                  {lesson.content}
                </p>
              </div>
            </div>
            <PrimaryButton disabled={completed} onClick={handleComplete}>
              {completed ? 'Leccion completada' : 'Marcar como completada'}
            </PrimaryButton>
          </section>
        </>
      )}
    </div>
  );
};

export default LessonScreen;
