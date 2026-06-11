import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = ({ title, subtitle, showBack = false, action }) => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center gap-3 px-5 pb-3 pt-5">
      {showBack && (
        <button
          aria-label="Volver"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gray-100 text-ink"
          type="button"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-xl font-bold tracking-normal text-ink">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
};

export default Header;
