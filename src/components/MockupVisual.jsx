import { cn } from '../lib/cn';

const MockupVisual = ({ variant = 'course', gradient = 'from-indigo-600 to-violet-600' }) => {
  if (variant === 'editor') {
    return (
      <div className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white p-3 shadow-ios">
        <div className="rounded-[1.6rem] bg-gray-950 p-2">
          <div className="overflow-hidden rounded-[1.25rem] bg-white">
            <div className={cn('h-16 bg-gradient-to-r', gradient)} />
            <div className="grid grid-cols-[74px_1fr] gap-3 p-3">
              <div className="space-y-2 rounded-2xl bg-gray-100 p-2">
                <span className="block h-2 rounded bg-gray-300" />
                <span className="block h-8 rounded-xl bg-white" />
                <span className="block h-8 rounded-xl bg-white" />
                <span className="block h-8 rounded-xl bg-white" />
              </div>
              <div className="rounded-3xl bg-gray-100 p-4">
                <div className="mx-auto aspect-square w-32 rounded-3xl bg-gradient-to-br from-white via-violet-100 to-indigo-200 p-4 shadow-sm">
                  <div className="h-full rounded-2xl border border-white bg-white/50 p-3">
                    <div className="h-4 w-20 rounded-full bg-violet" />
                    <div className="mt-5 h-14 rounded-2xl bg-indigo-500/70" />
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <span className="h-3 rounded bg-gray-400/50" />
                      <span className="h-3 rounded bg-gray-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-52 overflow-hidden rounded-[2rem] bg-gradient-to-br from-gray-50 to-indigo-50 p-5">
      <div className="absolute right-4 top-5 h-28 w-16 rounded-[1.35rem] border-4 border-gray-950 bg-white p-1 shadow-ios">
        <div className={cn('h-full rounded-[1rem] bg-gradient-to-br', gradient)}>
          <div className="p-2">
            <span className="block h-1.5 w-8 rounded bg-white/70" />
            <span className="mt-3 block h-8 rounded-lg bg-white/25" />
            <span className="mt-2 block h-2 rounded bg-white/50" />
          </div>
        </div>
      </div>
      <div className="absolute bottom-6 left-5 right-16 rounded-[1.5rem] border-[8px] border-gray-950 bg-gray-950 shadow-ios">
        <div className="overflow-hidden rounded-xl bg-white">
          <div className={cn('h-20 bg-gradient-to-r', gradient)} />
          <div className="grid grid-cols-3 gap-2 p-3">
            <span className="h-8 rounded-xl bg-gray-100" />
            <span className="h-8 rounded-xl bg-violet/10" />
            <span className="h-8 rounded-xl bg-gray-100" />
          </div>
        </div>
      </div>
      <div className="relative z-10 max-w-[11rem]">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet">
          Canva Pro
        </p>
        <h2 className="mt-2 text-2xl font-black leading-none text-ink">
          Disena, publica, vende.
        </h2>
      </div>
    </div>
  );
};

export default MockupVisual;
