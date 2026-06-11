import { Heart } from 'lucide-react';
import CourseCard from '../components/CourseCard';
import Header from '../components/Header';
import { useProgress } from '../context/ProgressContext';
import { courses } from '../data/courses';
import { isCourseLocked } from '../services/progressService';

const FavoritesScreen = () => {
  const { profile, toggleFavorite } = useProgress();
  const completedLessons = profile?.completedLessons ?? [];
  const favoriteCourses = profile?.favoriteCourses ?? [];
  const visibleCourses = courses.filter((course) =>
    favoriteCourses.includes(course.id),
  );

  return (
    <div className="space-y-5">
      <Header subtitle="Cursos guardados para despues" title="Favoritos" />
      <section className="space-y-4 px-5">
        {visibleCourses.length ? (
          visibleCourses.map((course) => (
            <CourseCard
              key={course.id}
              completedLessons={completedLessons}
              course={course}
              favorite
              locked={isCourseLocked(course, completedLessons)}
              onFavorite={() => toggleFavorite(course.id)}
            />
          ))
        ) : (
          <div className="rounded-[2rem] border border-dashed border-gray-200 bg-white p-8 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-3xl bg-violet/10 text-violet">
              <Heart className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-lg font-black text-ink">
              Aun no tienes favoritos
            </h2>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-muted">
              Guarda cursos para volver rapido a los temas que quieres practicar.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default FavoritesScreen;
