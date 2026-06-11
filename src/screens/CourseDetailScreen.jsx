import { BookOpen, CheckCircle2, Clock3, Heart, Lock } from 'lucide-react';
import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import LessonItem from '../components/LessonItem';
import MockupVisual from '../components/MockupVisual';
import PrimaryButton from '../components/PrimaryButton';
import ProgressBar from '../components/ProgressBar';
import { useProgress } from '../context/ProgressContext';
import { getCourseById } from '../data/courses';
import {
  calculateCourseProgress,
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
  const progress = calculateCourseProgress(course, completedLessons);
  const isFavorite = favoriteCourses.includes(course.id);

  return (
    <div className="space-y-5">
      <Header
        action={
          <button
            aria-label={isFavorite ? 'Quitar favorito' : 'Guardar favorito'}
            className="grid h-10 w-10 place-items-center rounded-full bg-gray-100 text-violet"
            type="button"
            onClick={() => toggleFavorite(course.id)}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-violet' : ''}`} />
          </button>
        }
        showBack
        subtitle={`Nivel ${course.level} | ${course.duration}`}
        title={course.title}
      />

      <section className="px-5">
        <MockupVisual gradient={course.gradient} />
      </section>

      <section className="space-y-4 px-5">
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-violet/10 px-3 py-2 text-xs font-bold text-violet">
            <Clock3 className="h-3.5 w-3.5" />
            {course.duration}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-2 text-xs font-bold text-muted">
            <BookOpen className="h-3.5 w-3.5" />
            {course.lessonsCount} lecciones
          </span>
          {locked ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-2 text-xs font-bold text-muted">
              <Lock className="h-3.5 w-3.5" />
              Bloqueado
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-600">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Disponible
            </span>
          )}
        </div>

        <p className="text-sm font-semibold leading-relaxed text-muted">
          {course.description}
        </p>

        <ProgressBar label="Avance del curso" value={progress} />

        <PrimaryButton
          disabled={locked}
          onClick={() => navigate(`/app/leccion/${firstLesson.id}`)}
        >
          {locked ? 'Completa el nivel anterior' : 'Comenzar clase'}
        </PrimaryButton>
      </section>

      <section className="px-5">
        <div className="grid grid-cols-2 rounded-3xl bg-gray-100 p-1">
          <button
            className={`rounded-[1.25rem] px-4 py-3 text-sm font-bold transition ${
              tab === 'lessons' ? 'bg-white text-ink shadow-sm' : 'text-muted'
            }`}
            type="button"
            onClick={() => setTab('lessons')}
          >
            Lecciones
          </button>
          <button
            className={`rounded-[1.25rem] px-4 py-3 text-sm font-bold transition ${
              tab === 'resources' ? 'bg-white text-ink shadow-sm' : 'text-muted'
            }`}
            type="button"
            onClick={() => setTab('resources')}
          >
            Recursos
          </button>
        </div>
      </section>

      {tab === 'lessons' ? (
        <section className="space-y-3 px-5">
          {course.lessons.map((lesson, index) => (
            <LessonItem
              key={lesson.id}
              completed={completedLessons.includes(lesson.id)}
              index={index}
              lesson={lesson}
              locked={locked}
            />
          ))}
        </section>
      ) : (
        <section className="space-y-3 px-5">
          {course.resources.map((resource) => (
            <div
              key={resource}
              className="rounded-3xl border border-gray-100 bg-white p-4 text-sm font-bold text-ink shadow-sm"
            >
              {resource}
              <p className="mt-2 text-xs font-semibold leading-relaxed text-muted">
                Material de apoyo para aplicar durante la clase virtual.
              </p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default CourseDetailScreen;
