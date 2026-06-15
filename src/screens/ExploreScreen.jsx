import { useMemo, useState } from 'react';
import CourseCard from '../components/CourseCard';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import { useProgress } from '../context/ProgressContext';
import { courses } from '../data/courses';
import { isCourseLocked } from '../services/progressService';

const ExploreScreen = () => {
  const { profile, toggleFavorite } = useProgress();
  const [query, setQuery] = useState('');
  const completedLessons = profile?.completedLessons ?? [];
  const passedExams = profile?.passedExams ?? [];
  const favoriteCourses = profile?.favoriteCourses ?? [];

  const filteredCourses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return courses;
    return courses.filter((course) =>
      [course.title, course.objective, course.description]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query]);

  return (
    <div className="space-y-5">
      <Header subtitle="Encuentra tu siguiente clase" title="Explorar" />
      <SearchBar value={query} onChange={setQuery} placeholder="Buscar por tema" />
      <section className="space-y-4 px-5">
        {filteredCourses.map((course) => (
          <CourseCard
            key={course.id}
            completedLessons={completedLessons}
            course={course}
            favorite={favoriteCourses.includes(course.id)}
            passedExams={passedExams}
            locked={isCourseLocked(
              course,
              completedLessons,
              passedExams,
            )}
            onFavorite={() => toggleFavorite(course.id)}
          />
        ))}
      </section>
    </div>
  );
};

export default ExploreScreen;
