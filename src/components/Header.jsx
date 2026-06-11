import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = ({ title, subtitle, showBack = false, action }) => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center gap-3 px-8 pb-4 pt-7">
      {showBack && (
        <button
          aria-label="Volver"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-ink"
          type="button"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-7 w-7" strokeWidth={2.2} />
        </button>
      )}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-xl font-black tracking-normal text-ink">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
};

export default Header;
