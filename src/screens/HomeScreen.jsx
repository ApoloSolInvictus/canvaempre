import { Bell, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
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
    <div className="space-y-8 pb-2 pt-14">
      <header className="flex items-start justify-between px-8">
        <div>
          <h1 className="text-[2rem] font-black leading-tight text-ink">
            &iexcl;Hola, Emprendedor! <span aria-hidden="true">👋</span>
          </h1>
          <p className="mt-3 text-[1.65rem] font-medium leading-tight text-ink">
            &iquest;Qu&eacute; vamos a dise&ntilde;ar hoy?
          </p>
        </div>
        <button
          aria-label="Notificaciones"
          className="relative mt-1 grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-ink"
          type="button"
        >
          <Bell className="h-8 w-8" strokeWidth={2.2} />
          <span className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-violet text-xs font-black text-white">
            2
          </span>
        </button>
      </header>

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Buscar clases, temas o herramientas..."
      />

      <section className="space-y-5 px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-[1.35rem] font-black text-ink">Contin&uacute;a aprendiendo</h2>
          <button className="text-lg font-bold text-violet" type="button">
            Ver todo
          </button>
        </div>
        <article className="flex items-center gap-4 rounded-[1.35rem] border border-gray-200 bg-white p-3">
          <div className="relative h-[92px] w-[92px] shrink-0 overflow-hidden rounded-[1.15rem] bg-[#f6eee6]">
            <div className="absolute inset-x-0 top-0 h-7 bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-600" />
            <div className="absolute bottom-2 right-3 h-12 w-12 rounded-t-full bg-[#e8d8c5]" />
            <div className="absolute left-3 top-12 text-[9px] font-black leading-tight text-ink">
              NUEVA
              <br />
              COLECCION
            </div>
          </div>
          <button
            className="min-w-0 flex-1 text-left"
            type="button"
            onClick={() => next && navigate(`/app/leccion/${next.lesson.id}`)}
          >
            <p className="text-xs font-semibold uppercase text-muted">
              Nivel {next ? next.course.level : stats.currentLevel}
            </p>
            <h3 className="mt-1 line-clamp-2 text-lg font-black leading-snug text-ink">
              {next ? next.course.title : 'Ruta completada'}
            </h3>
            <div className="mt-4">
              <ProgressBar compact value={stats.totalProgress} />
            </div>
          </button>
          <button
            aria-label="Continuar clase"
            className="flex h-12 w-20 shrink-0 items-center justify-end gap-2 bg-white text-muted"
            type="button"
            onClick={() => next && navigate(`/app/leccion/${next.lesson.id}`)}
          >
            <span className="text-xl font-black text-violet">
              {stats.totalProgress}%
            </span>
            <ChevronRight className="h-7 w-7" />
          </button>
        </article>
      </section>

      <section className="space-y-5 px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-[1.35rem] font-black text-ink">Ruta de aprendizaje</h2>
          <button className="text-lg font-bold text-violet" type="button">
            Ver ruta
          </button>
        </div>
        <div className="space-y-4">
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

      <section className="space-y-4 px-8">
        <h2 className="text-[1.35rem] font-black text-ink">Clases destacadas</h2>
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
