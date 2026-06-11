import { Check, ChevronRight, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LessonItem = ({ lesson, completed = false, locked = false, index }) => {
  const navigate = useNavigate();

  return (
    <button
      className="flex w-full items-center gap-3 border-b border-gray-200 py-3.5 text-left transition active:scale-[0.995] disabled:opacity-60 disabled:active:scale-100"
      type="button"
      disabled={locked}
      onClick={() => navigate(`/app/leccion/${lesson.id}`)}
    >
      <span className="min-w-0 flex-1">
        <span className="line-clamp-1 block text-[15px] font-black leading-tight text-ink">
          {index + 1}. {lesson.title}
        </span>
        <span className="mt-1 line-clamp-1 block text-sm font-medium text-muted">
          {lesson.objective}
        </span>
      </span>
      <span className="shrink-0 text-sm font-medium text-muted">{lesson.duration}</span>
      {locked ? (
        <Lock className="h-5 w-5 shrink-0 text-muted" />
      ) : completed ? (
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-500 text-white">
          <Check className="h-[18px] w-[18px]" strokeWidth={3} />
        </span>
      ) : (
        <ChevronRight className="h-6 w-6 shrink-0 text-muted" />
      )}
    </button>
  );
};

export default LessonItem;
