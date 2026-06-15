import {
  Check,
  ChevronRight,
  ImagePlus,
  Layers3,
  Lock,
  Palette,
  Presentation,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/cn';
import { calculateCourseProgress } from '../services/progressService';

const styles = [
  {
    shell: 'border-emerald-200 bg-emerald-50/75',
    icon: 'bg-emerald-100 text-emerald-500',
    iconComponent: Palette,
  },
  {
    shell: 'border-violet-200 bg-violet-50/80',
    icon: 'bg-violet-100 text-violet',
    iconComponent: Layers3,
  },
  {
    shell: 'border-violet-200 bg-violet-50/80',
    icon: 'bg-violet-100 text-violet',
    iconComponent: ImagePlus,
  },
  {
    shell: 'border-amber-200 bg-amber-50/75',
    icon: 'bg-amber-100 text-amber-500',
    iconComponent: Sparkles,
  },
  {
    shell: 'border-rose-200 bg-rose-50/75',
    icon: 'bg-rose-100 text-rose-500',
    iconComponent: Presentation,
  },
];

const LevelCard = ({
  course,
  completedLessons = [],
  passedExams = [],
  locked = false,
}) => {
  const navigate = useNavigate();
  const progress = calculateCourseProgress(
    course,
    completedLessons,
    passedExams,
  );
  const complete = passedExams.includes(course.id);
  const style = styles[course.level] ?? styles[1];
  const Icon = style.iconComponent;

  return (
    <button
      className={cn(
        'flex min-h-[92px] w-full items-center gap-4 rounded-[1.35rem] border px-4 py-3 text-left transition active:scale-[0.99] disabled:active:scale-100',
        style.shell,
      )}
      type="button"
      disabled={locked}
      onClick={() => navigate(`/app/curso/${course.id}`)}
    >
      <span className={cn('grid h-16 w-16 shrink-0 place-items-center rounded-[1.25rem]', style.icon)}>
        <Icon className="h-8 w-8" strokeWidth={2.2} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-black text-ink">Nivel {course.level}</span>
        <span className="mt-1 line-clamp-2 block text-base font-black leading-snug text-ink">
          {course.title}
        </span>
        <span className="mt-2 block text-sm font-medium text-muted">
          {course.duration} · {course.lessonsCount} lecciones · 1 examen
        </span>
      </span>
      {locked ? (
        <Lock className="h-6 w-6 shrink-0 text-muted" />
      ) : complete ? (
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-emerald-500 text-white shadow-[0_12px_28px_rgba(34,197,94,0.25)]">
          <Check className="h-7 w-7" strokeWidth={3} />
        </span>
      ) : (
        <ChevronRight className="h-8 w-8 shrink-0 text-ink" strokeWidth={2.3} />
      )}
    </button>
  );
};

export default LevelCard;
