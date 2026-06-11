import { ChevronRight, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/cn';
import { calculateCourseProgress } from '../services/progressService';
import ProgressBar from './ProgressBar';

const MiniPoster = ({ gradient }) => (
  <div className="relative h-full w-full overflow-hidden rounded-[1.15rem] bg-[#f5eee7]">
    <div className={cn('absolute inset-x-0 top-0 h-7 bg-gradient-to-r', gradient)} />
    <div className="absolute bottom-0 right-0 h-2/3 w-1/2 rounded-t-full bg-[#e7d9ca]" />
    <div className="absolute left-3 top-11 text-[9px] font-black leading-tight text-ink">
      NUEVA
      <br />
      COLECCION
    </div>
    <div className="absolute bottom-5 right-4 h-8 w-10 rounded-[1rem] bg-[#d9b997]" />
    <div className="absolute bottom-4 right-3 h-4 w-12 rounded-t-xl bg-[#c99d73]" />
  </div>
);

const CourseCard = ({
  course,
  completedLessons = [],
  favorite = false,
  locked = false,
  onFavorite,
}) => {
  const navigate = useNavigate();
  const progress = calculateCourseProgress(course, completedLessons);

  return (
    <article className={cn('rounded-[1.35rem] border border-gray-200 bg-white p-3 transition', locked && 'opacity-65')}>
      <div className="flex items-center gap-4">
        <button
          className="h-[92px] w-[92px] shrink-0 overflow-hidden rounded-[1.15rem]"
          type="button"
          onClick={() => !locked && navigate(`/app/curso/${course.id}`)}
        >
          <MiniPoster gradient={course.gradient} />
        </button>

        <button
          className="min-w-0 flex-1 text-left"
          disabled={locked}
          type="button"
          onClick={() => navigate(`/app/curso/${course.id}`)}
        >
          <p className="text-xs font-semibold uppercase text-muted">
            Nivel {course.level}
          </p>
          <h3 className="mt-1 line-clamp-2 text-base font-black leading-snug text-ink">
            {course.title}
          </h3>
          <div className="mt-4">
            <ProgressBar compact value={progress} />
          </div>
        </button>

        <div className="grid justify-items-center gap-2">
          <span className="text-lg font-black text-violet">{progress}%</span>
          <button
            aria-label={favorite ? 'Quitar favorito' : 'Guardar favorito'}
            className="grid h-8 w-8 place-items-center rounded-full text-muted"
            type="button"
            onClick={onFavorite}
          >
            <Heart className={cn('h-5 w-5', favorite && 'fill-violet text-violet')} />
          </button>
          <ChevronRight className="h-6 w-6 text-muted" />
        </div>
      </div>
    </article>
  );
};

export default CourseCard;
