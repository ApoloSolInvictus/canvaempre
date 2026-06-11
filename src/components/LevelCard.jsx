import { CheckCircle2, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { calculateCourseProgress } from '../services/progressService';
import { cn } from '../lib/cn';
import ProgressBar from './ProgressBar';

const LevelCard = ({ course, completedLessons = [], locked = false }) => {
  const navigate = useNavigate();
  const progress = calculateCourseProgress(course, completedLessons);
  const complete = progress === 100;

  return (
    <button
      className="grid w-[220px] shrink-0 gap-4 rounded-3xl border border-gray-100 bg-white p-4 text-left shadow-sm transition active:scale-[0.99] disabled:active:scale-100"
      type="button"
      disabled={locked}
      onClick={() => navigate(`/app/curso/${course.id}`)}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            'grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br text-sm font-black text-white',
            course.gradient,
          )}
        >
          {course.level}
        </div>
        {locked ? (
          <Lock className="h-5 w-5 text-muted" />
        ) : complete ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        ) : (
          <span className="rounded-full bg-violet/10 px-3 py-1 text-xs font-bold text-violet">
            {progress}%
          </span>
        )}
      </div>
      <div>
        <h3 className="line-clamp-2 text-base font-bold leading-tight text-ink">
          {course.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
          {course.objective}
        </p>
      </div>
      <ProgressBar compact value={progress} />
    </button>
  );
};

export default LevelCard;
