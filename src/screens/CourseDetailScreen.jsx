import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  Clock3,
  Heart,
  List,
  Lock,
  Play,
  Share2,
} from 'lucide-react';
import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import LessonItem from '../components/LessonItem';
import MockupVisual from '../components/MockupVisual';
import PrimaryButton from '../components/PrimaryButton';
import { useProgress } from '../context/ProgressContext';
import { getCourseById } from '../data/courses';
import {
  isCourseLocked,
} from '../services/progressService';

const CourseDetailScreen = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState('lessons');
  const { profile, toggleFavorite } = useProgress();
  const course = getCourseById(courseId);
  const completedLessons = profile?.completedLessons ?? [];
  const favoriteCourses = profile?.favoriteCourses ?? [];

  if (!course) return <Navigate replace to="/app" />;

  const firstLesson =
    course.lessons.find((lesson) => !completedLessons.includes(lesson.id)) ??
    course.lessons[0];
  const locked = isCourseLocked(course, completedLessons);
  const isFavorite = favoriteCourses.includes(course.id);
  const isLessonLocked = (lesson, index) =>
    locked ||
    (!completedLessons.includes(lesson.id) &&
      index > 0 &&
      !completedLessons.includes(course.lessons[index - 1].id));

  return (
    <div className="space-y-6 pb-2 pt-12">
      <header className="flex items-center justify-between px-8">
        <button
          aria-label="Volver"
          className="grid h-11 w-11 place-items-center rounded-full bg-white text-ink"
          type="button"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-8 w-8" strokeWidth={2.1} />
        </button>
        <div className="flex items-center gap-4">
          <button
            aria-label={isFavorite ? 'Quitar favorito' : 'Guardar favorito'}
            className="grid h-11 w-11 place-items-center rounded-full bg-white text-ink"
            type="button"
            onClick={() => toggleFavorite(course.id)}
          >
            <Heart className={`h-8 w-8 ${isFavorite ? 'fill-violet text-violet' : ''}`} strokeWidth={2.1} />
          </button>
          <button
            aria-label="Compartir"
            className="grid h-11 w-11 place-items-center rounded-full bg-white text-ink"
            type="button"
          >
            <Share2 className="h-8 w-8" strokeWidth={2.1} />
          </button>
        </div>
      </header>

      <section className="space-y-5 px-8">
        <span className="inline-flex rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-black uppercase text-white shadow-[0_12px_28px_rgba(109,53,255,0.24)]">
          Nivel {course.level}
        </span>
        <h1 className="text-[2.55rem] font-black leading-[1.06] text-ink">
          {course.title}
        </h1>
        <div className="flex items-center gap-8 text-lg font-medium text-muted">
          <span className="inline-flex items-center gap-2">
            <Clock3 className="h-6 w-6" strokeWidth={2.1} />
            {course.duration}
          </span>
          <span className="inline-flex items-center gap-2">
            <List className="h-6 w-6" strokeWidth={2.1} />
            {course.lessonsCount} lecciones
          </span>
        </div>
        <p className="text-lg font-medium leading-relaxed text-ink">
          {course.description}
        </p>
        <MockupVisual gradient={course.gradient} />
      </section>

      <section className="px-8">
        <PrimaryButton
          disabled={locked}
          onClick={() => navigate(`/app/leccion/${firstLesson.id}`)}
        >
          {locked ? (
            <>
              <Lock className="h-5 w-5" />
              Completa el nivel anterior
            </>
          ) : (
            <>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-violet">
                <Play className="h-4 w-4 fill-violet" />
              </span>
              Comenzar clase
            </>
          )}
        </PrimaryButton>
      </section>

      <section className="border-b border-gray-200">
        <div className="grid grid-cols-2">
          <button
            className={`relative px-4 py-4 text-lg font-black transition ${
              tab === 'lessons' ? 'text-violet' : 'text-muted'
            }`}
            type="button"
            onClick={() => setTab('lessons')}
          >
            Lecciones
            {tab === 'lessons' && <span className="absolute bottom-[-1px] left-0 h-0.5 w-full bg-violet" />}
          </button>
          <button
            className={`relative px-4 py-4 text-lg font-black transition ${
              tab === 'resources' ? 'text-violet' : 'text-muted'
            }`}
            type="button"
            onClick={() => setTab('resources')}
          >
            Recursos
            {tab === 'resources' && <span className="absolute bottom-[-1px] left-0 h-0.5 w-full bg-violet" />}
          </button>
        </div>
      </section>

      {tab === 'lessons' ? (
        <section className="px-8">
          {course.lessons.map((lesson, index) => (
            <LessonItem
              key={lesson.id}
              completed={completedLessons.includes(lesson.id)}
              index={index}
              lesson={lesson}
              locked={isLessonLocked(lesson, index)}
            />
          ))}
        </section>
      ) : (
        <section className="space-y-3 px-8">
          {course.resources.map((resource) => (
            <div
              key={resource.title}
              className="rounded-[1.35rem] border border-gray-200 bg-white p-5 text-ink"
            >
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-violet/10 text-violet">
                  <BookOpen className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-violet">
                    {resource.type}
                  </p>
                  <h3 className="mt-1 text-lg font-black leading-tight text-ink">
                    {resource.title}
                  </h3>
                </div>
              </div>
              <p className="mt-4 text-sm font-medium leading-relaxed text-muted">
                {resource.description}
              </p>
              <ul className="mt-4 space-y-2.5">
                {resource.items.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm font-semibold leading-relaxed text-ink">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 rounded-2xl bg-violet/5 p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-violet">
                  Cómo usarlo
                </p>
                <p className="mt-2 text-sm font-medium leading-relaxed text-ink">
                  {resource.useCase}
                </p>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default CourseDetailScreen;
