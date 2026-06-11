import { CheckCircle2, Clock3, Heart, Lock, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { calculateCourseProgress } from '../services/progressService';
import { cn } from '../lib/cn';
import ProgressBar from './ProgressBar';

const CourseCard = ({
  course,
  completedLessons = [],
  favorite = false,
  locked = false,
  onFavorite,
}) => {
  const navigate = useNavigate();
  const progress = calculateCourseProgress(course, completedLessons);
  const isComplete = progress === 100;

  return (
    <article
      className={cn(
        'rounded-3xl border border-gray-100 bg-white p-4 shadow-sm transition',
        locked ? 'opacity-70' : 'shadow-ios',
      )}
    >
      <div className="flex gap-4">
        <button
          className={cn(
            'relative h-24 w-24 shrink-0 overflow-hidden rounded-3xl bg-gradient-to-br p-3 text-white',
            course.gradient,
          )}
          type="button"
          onClick={() => !locked && navigate(`/app/curso/${course.id}`)}
        >
          <div className="absolute inset-0 bg-white/10" />
          <div className="relative h-full rounded-2xl border border-white/30 bg-white/15 p-2">
            <div className="mb-2 h-2 w-10 rounded-full bg-white/70" />
            <div className="h-8 rounded-xl bg-white/25" />
            <div className="mt-2 grid grid-cols-3 gap-1">
              <span className="h-3 rounded bg-white/35" />
              <span className="h-3 rounded bg-white/25" />
              <span className="h-3 rounded bg-white/35" />
            </div>
          </div>
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet">
                Nivel {course.level}
              </p>
              <h3 className="mt-1 line-clamp-2 text-base font-bold leading-tight text-ink">
                {course.title}
              </h3>
            </div>
            <button
              aria-label={favorite ? 'Quitar favorito' : 'Guardar favorito'}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gray-100 text-violet"
              type="button"
              onClick={onFavorite}
            >
              <Heart className={cn('h-4 w-4', favorite && 'fill-violet')} />
            </button>
          </div>

          <div className="mt-3 flex items-center gap-3 text-xs font-semibold text-muted">
            <span className="inline-flex items-center gap-1">
              <Clock3 className="h-3.5 w-3.5" />
              {course.duration}
            </span>
            <span>{course.lessonsCount} lecciones</span>
          </div>

          <div className="mt-3">
            <ProgressBar compact value={progress} />
          </div>
        </div>
      </div>

      <button
        className={cn(
          'mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-3xl text-sm font-bold transition',
          locked
            ? 'bg-gray-100 text-muted'
            : 'bg-ink text-white active:scale-[0.99]',
        )}
        type="button"
        disabled={locked}
        onClick={() => navigate(`/app/curso/${course.id}`)}
      >
        {locked ? <Lock className="h-4 w-4" /> : isComplete ? <CheckCircle2 className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
        {locked ? 'Completa el nivel anterior' : isComplete ? 'Repasar curso' : 'Abrir curso'}
      </button>
    </article>
  );
};

export default CourseCard;
