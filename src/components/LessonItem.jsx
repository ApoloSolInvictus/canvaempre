import { CheckCircle2, Circle, Clock3, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/cn';

const LessonItem = ({ lesson, completed = false, locked = false, index }) => {
  const navigate = useNavigate();

  return (
    <button
      className="flex w-full items-center gap-3 rounded-3xl border border-gray-100 bg-white p-4 text-left shadow-sm transition active:scale-[0.99] disabled:opacity-60 disabled:active:scale-100"
      type="button"
      disabled={locked}
      onClick={() => navigate(`/app/leccion/${lesson.id}`)}
    >
      <div
        className={cn(
          'grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-sm font-black',
          completed
            ? 'bg-emerald-50 text-emerald-500'
            : locked
              ? 'bg-gray-100 text-muted'
              : 'bg-violet/10 text-violet',
        )}
      >
        {completed ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : locked ? (
          <Lock className="h-5 w-5" />
        ) : (
          index + 1
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 text-sm font-bold leading-tight text-ink">
          {lesson.title}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-muted">
          <Clock3 className="h-3.5 w-3.5" />
          {lesson.duration}
        </p>
      </div>
      {completed ? (
        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
      ) : (
        <Circle className="h-5 w-5 text-gray-300" />
      )}
    </button>
  );
};

export default LessonItem;
