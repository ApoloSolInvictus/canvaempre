import CourseCard from '../components/CourseCard';
import Header from '../components/Header';
import { useProgress } from '../context/ProgressContext';
import { courses } from '../data/courses';
import {
  calculateCourseProgress,
  isCourseLocked,
} from '../services/progressService';

const MyClassesScreen = () => {
  const { profile, toggleFavorite } = useProgress();
  const completedLessons = profile?.completedLessons ?? [];
  const favoriteCourses = profile?.favoriteCourses ?? [];
  const startedCourses = courses.filter(
    (course) =>
      calculateCourseProgress(course, completedLessons) > 0 ||
      !isCourseLocked(course, completedLessons),
  );

  return (
    <div className="space-y-5">
      <Header subtitle="Tus avances guardados" title="Mis Clases" />
      <section className="space-y-4 px-5">
        {startedCourses.map((course) => (
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

export default MyClassesScreen;
