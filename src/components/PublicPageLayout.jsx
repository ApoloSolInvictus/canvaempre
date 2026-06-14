import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PublicFooter from './PublicFooter';

const PublicPageLayout = ({ eyebrow, title, description, children }) => {
  const navigate = useNavigate();

  return (
    <div className="phone-shell min-h-screen bg-white">
      <header className="border-b border-gray-100 px-5 pb-6 pt-6">
        <button
          aria-label="Volver"
          className="grid h-11 w-11 place-items-center rounded-full border border-gray-100 bg-white text-ink shadow-sm"
          type="button"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <p className="mt-7 text-xs font-black uppercase text-violet">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-black leading-tight text-ink">
          {title}
        </h1>
        {description && (
          <p className="mt-3 text-sm font-semibold leading-relaxed text-muted">
            {description}
          </p>
        )}
      </header>
      <main className="space-y-7 px-6 py-7">{children}</main>
      <PublicFooter />
    </div>
  );
};

export default PublicPageLayout;

