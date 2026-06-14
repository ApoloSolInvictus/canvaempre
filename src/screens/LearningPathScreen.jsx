import { CheckCircle2, Route } from 'lucide-react';
import Header from '../components/Header';
import LevelCard from '../components/LevelCard';
import ProgressBar from '../components/ProgressBar';
import { useProgress } from '../context/ProgressContext';
import { courses } from '../data/courses';
import { isCourseLocked } from '../services/progressService';

const LearningPathScreen = () => {
  const { profile, stats } = useProgress();
  const completedLessons = profile?.completedLessons ?? [];

  return (
    <div className="space-y-5">
      <Header
        subtitle="Cinco niveles, cuarenta clases"
        title="Ruta de aprendizaje"
      />
      <section className="mx-5 rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 p-5 text-white shadow-soft">
        <Route className="h-7 w-7" />
        <h2 className="mt-4 text-2xl font-black">
          Avanza en orden y construye tu marca.
        </h2>
        <p className="mt-2 text-sm font-semibold leading-relaxed text-white/75">
          Cada nivel se desbloquea al completar el anterior.
        </p>
        <div className="mt-5 rounded-2xl bg-white/15 p-4">
          <ProgressBar label="Progreso total" value={stats.totalProgress} />
        </div>
      </section>

      <section className="space-y-4 px-5">
        {courses.map((course) => (
          <LevelCard
            key={course.id}
            completedLessons={completedLessons}
            course={course}
            locked={isCourseLocked(course, completedLessons)}
          />
        ))}
      </section>

      <section className="mx-5 flex gap-3 rounded-3xl bg-emerald-50 p-5 text-emerald-800">
        <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0" />
        <p className="text-sm font-semibold leading-relaxed">
          Al llegar al 100 % podrás emitir tu certificado digital de W Studio.
        </p>
      </section>
    </div>
  );
};

export default LearningPathScreen;

