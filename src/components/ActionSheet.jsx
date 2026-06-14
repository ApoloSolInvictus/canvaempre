import { X } from 'lucide-react';

const ActionSheet = ({ open, title, description, onClose, children }) => {
  if (!open) return null;

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-40 flex items-end justify-center bg-ink/35 px-3 pb-[calc(12px+env(safe-area-inset-bottom))]"
      role="dialog"
    >
      <button
        aria-label="Cerrar"
        className="absolute inset-0 cursor-default"
        type="button"
        onClick={onClose}
      />
      <section className="relative z-10 w-full max-w-[416px] rounded-[1.8rem] bg-white p-5 shadow-[0_24px_80px_rgba(9,11,31,0.26)]">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-ink">{title}</h2>
            {description && (
              <p className="mt-1 text-sm font-semibold leading-relaxed text-muted">
                {description}
              </p>
            )}
          </div>
          <button
            aria-label="Cerrar"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gray-100 text-muted"
            type="button"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="mt-5 space-y-3">{children}</div>
      </section>
    </div>
  );
};

export default ActionSheet;

