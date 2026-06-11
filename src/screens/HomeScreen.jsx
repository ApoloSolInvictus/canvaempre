import { ArrowRight, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import Header from '../components/Header';
import LevelCard from '../components/LevelCard';
import ProgressBar from '../components/ProgressBar';
import SearchBar from '../components/SearchBar';
import { useProgress } from '../context/ProgressContext';
import { courses } from '../data/courses';
import {
  getNextLesson,
  isCourseLocked,
} from '../services/progressService';

const HomeScreen = () => {
  const navigate = useNavigate();
  const { profile, loading, stats, toggleFavorite } = useProgress();
  const [query, setQuery] = useState('');
  const completedLessons = profile?.completedLessons ?? [];
  const favoriteCourses = profile?.favoriteCourses ?? [];
  const next = getNextLesson(completedLessons);

  const filteredCourses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return courses;

    return courses.filter((course) =>
      [course.title, course.description, course.objective]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query]);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet/20 border-t-violet" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Header
        subtitle={profile?.name ? `Listo para crear, ${profile.name}` : 'Tu ruta creativa'}
        title={'\u00a1Hola, Emprendedor!'}
      />

      <SearchBar value={query} onChange={setQuery} />

      <section className="mx-5 rounded-[2rem] bg-gradient-to-br from-indigo-600 to-violet-600 p-5 text-white shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-white/75">
              <Sparkles className="h-4 w-4" />
              Continua aprendiendo
            </p>
            <h2 className="mt-3 text-2xl font-black leading-tight">
              {next ? next.lesson.title : 'Ruta completada'}
            </h2>
            <p className="mt-2 text-sm font-semibold text-white/75">
              {next ? next.course.title : 'Ya completaste todos los niveles.'}
            </p>
          </div>
          <button
            aria-label="Continuar clase"
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-violet"
            type="button"
            onClick={() => next && navigate(`/app/leccion/${next.lesson.id}`)}
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-6 rounded-3xl bg-white/15 p-4">
          <ProgressBar label="Progreso total" value={stats.totalProgress} />
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between px-5">
          <h2 className="text-lg font-black text-ink">Ruta por niveles</h2>
          <span className="text-sm font-bold text-violet">
            Nivel {stats.currentLevel}
          </span>
        </div>
        <div className="hide-scrollbar flex gap-4 overflow-x-auto px-5 pb-1">
          {courses.map((course) => (
            <LevelCard
              key={course.id}
              completedLessons={completedLessons}
              course={course}
              locked={isCourseLocked(course, completedLessons)}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4 px-5">
        <h2 className="text-lg font-black text-ink">Clases destacadas</h2>
        {filteredCourses.map((course) => (
          <CourseCard
            key={course.id}
            completedLessons={completedLessons}
            course={course}
            favorite={favoriteCourses.includes(course.id)}
            locked={isCourseLocked(course, completedLessons)}
            onFavorite={() => toggleFavorite(course.id)}
          />
        ))}
      </section>
    </div>
  );
};

export default HomeScreen;
