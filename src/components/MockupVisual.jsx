import {
  Download,
  FileText,
  Folder,
  Grid3X3,
  Heart,
  Image,
  Infinity as InfinityIcon,
  MoreHorizontal,
  Redo2,
  Type,
  Undo2,
  UploadCloud,
} from 'lucide-react';
import { cn } from '../lib/cn';

const ChairArtwork = ({ compact = false }) => (
  <div
    className={cn(
      'relative mx-auto overflow-hidden rounded-t-full bg-gradient-to-b from-stone-300/65 to-stone-50',
      compact ? 'h-24 w-20' : 'h-36 w-28',
    )}
  >
    <div className="absolute bottom-3 left-1/2 h-12 w-16 -translate-x-1/2 rounded-[1.5rem] bg-[#ead8c3] shadow-[inset_0_-10px_18px_rgba(160,117,82,0.18)]" />
    <div className="absolute bottom-0 left-1/2 h-8 w-20 -translate-x-1/2 rounded-t-[1.4rem] bg-[#d7b18d]" />
    <div className="absolute bottom-0 left-[36%] h-8 w-1 rotate-12 rounded-full bg-[#8b5f3c]" />
    <div className="absolute bottom-0 right-[36%] h-8 w-1 -rotate-12 rounded-full bg-[#8b5f3c]" />
  </div>
);

const CanvasPoster = ({ compact = false }) => (
  <div
    className={cn(
      'relative overflow-hidden bg-[#fbf7f1] shadow-[0_18px_42px_rgba(119,92,68,0.12)]',
      compact ? 'h-32 w-24 rounded-xl p-3' : 'aspect-[4/3] rounded-[1.4rem] p-7',
    )}
  >
    <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-b from-[#efe4d8] to-[#fffaf4]" />
    <div className="relative z-10 grid h-full grid-cols-2 items-center gap-3">
      <div className="text-center">
        <p
          className={cn(
            'font-serif leading-tight text-ink',
            compact ? 'text-[13px]' : 'text-2xl',
          )}
        >
          NUEVA
          <br />
          COLECCION
        </p>
        <p
          className={cn(
            'mx-auto mt-2 max-w-[8rem] text-muted',
            compact ? 'hidden' : 'text-xs',
          )}
        >
          Descubre lo ultimo para esta temporada.
        </p>
        <span
          className={cn(
            'mx-auto mt-4 block rounded-full bg-[#d7a77f] text-center font-bold text-ink',
            compact ? 'h-2 w-12' : 'w-28 px-3 py-2 text-[10px]',
          )}
        >
          {!compact && 'COMPRAR AHORA'}
        </span>
      </div>
      <ChairArtwork compact={compact} />
    </div>
  </div>
);

const CanvaTopbar = ({ gradient }) => (
  <div className={cn('flex h-12 items-center gap-4 bg-gradient-to-r px-4 text-white', gradient)}>
    <span className="font-serif text-xl font-black italic">Canva</span>
    <Undo2 className="h-5 w-5 opacity-85" />
    <Redo2 className="h-5 w-5 opacity-45" />
    <span className="flex-1" />
    <InfinityIcon className="h-5 w-5 opacity-85" />
    <FileText className="h-5 w-5 opacity-85" />
    <Download className="h-6 w-6 opacity-95" />
    <MoreHorizontal className="h-6 w-6 opacity-95" />
  </div>
);

const SidebarItem = ({ icon: Icon, label }) => (
  <div className="grid justify-items-center gap-1 text-[10px] font-medium text-white/72">
    <Icon className="h-5 w-5 text-white" strokeWidth={1.8} />
    <span>{label}</span>
  </div>
);

const SelectionBox = ({ className = '' }) => (
  <div className={cn('absolute border border-violet-400', className)}>
    <span className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-full border border-violet-400 bg-white" />
    <span className="absolute -right-1.5 -top-1.5 h-3 w-3 rounded-full border border-violet-400 bg-white" />
    <span className="absolute -bottom-1.5 -left-1.5 h-3 w-3 rounded-full border border-violet-400 bg-white" />
    <span className="absolute -bottom-1.5 -right-1.5 h-3 w-3 rounded-full border border-violet-400 bg-white" />
  </div>
);

const EditorMockup = ({ gradient }) => (
  <div className="overflow-hidden rounded-[1.35rem] bg-white shadow-[0_18px_52px_rgba(9,11,31,0.12)]">
    <CanvaTopbar gradient={gradient} />
    <div className="grid grid-cols-[58px_1fr] bg-[#f6f8fb]">
      <aside className="grid gap-5 bg-[#080d16] px-2 py-4">
        <SidebarItem icon={Image} label="Diseno" />
        <SidebarItem icon={Heart} label="Elementos" />
        <SidebarItem icon={Type} label="Texto" />
        <SidebarItem icon={UploadCloud} label="Subidos" />
        <SidebarItem icon={Folder} label="Proyectos" />
        <SidebarItem icon={Grid3X3} label="Apps" />
      </aside>
      <div className="p-6">
        <div className="relative mx-auto aspect-square max-w-[295px] bg-[#fbf8f2] shadow-[0_14px_35px_rgba(62,52,43,0.12)]">
          <SelectionBox className="inset-4" />
          <div className="absolute left-8 top-20 w-32 text-center">
            <p className="font-serif text-2xl leading-tight text-ink">
              NUEVA
              <br />
              COLECCION
            </p>
            <p className="mt-4 text-xs leading-relaxed text-muted">
              Descubre lo ultimo para esta temporada.
            </p>
            <span className="mx-auto mt-5 block w-28 rounded-full bg-[#d7a77f] py-2 text-center text-[10px] font-bold text-ink">
              COMPRAR AHORA
            </span>
          </div>
          <div className="absolute right-8 top-14 h-44 w-28 overflow-hidden rounded-t-full bg-gradient-to-b from-stone-300/75 to-stone-50" />
          <div className="absolute bottom-12 right-12 h-16 w-20 rounded-[1.5rem] bg-[#ead8c3] shadow-[inset_0_-10px_18px_rgba(160,117,82,0.18)]" />
          <div className="absolute bottom-9 right-10 h-8 w-24 rounded-t-[1.4rem] bg-[#d7b18d]" />
          <SelectionBox className="bottom-9 right-8 h-40 w-28" />
        </div>
      </div>
    </div>
  </div>
);

const DeviceMockup = ({ gradient }) => (
  <div className="relative min-h-[220px] overflow-hidden rounded-[1.35rem] bg-[#eee9e4] px-6 pb-5 pt-4 shadow-[0_18px_48px_rgba(9,11,31,0.12)]">
    <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[#f5f0eb] to-[#e6ddd3]" />
    <div className="absolute bottom-0 left-0 right-0 h-[38%] bg-white/80" />
    <div className="absolute bottom-5 left-7 right-24 z-10 rounded-t-[1rem] bg-[#0a0d13] p-2 shadow-[0_20px_45px_rgba(0,0,0,0.28)]">
      <div className="overflow-hidden rounded-t-lg bg-white">
        <CanvaTopbar gradient={gradient} />
        <div className="grid grid-cols-[44px_1fr]">
          <div className="space-y-2 bg-[#0a0d13] px-2 py-3">
            <span className="block h-4 rounded bg-white/18" />
            <span className="block h-4 rounded bg-white/14" />
            <span className="block h-4 rounded bg-white/14" />
            <span className="block h-4 rounded bg-white/14" />
          </div>
          <div className="bg-[#fbf8f2] p-5">
            <div className="grid grid-cols-2 items-center gap-4">
              <div>
                <p className="text-2xl font-black leading-tight text-ink">
                  Tu marca
                  <br />
                  merece ser
                  <br />
                  recordada
                </p>
                <span className="mt-4 inline-flex rounded-full bg-violet px-3 py-1 text-[10px] font-bold text-white">
                  Descubre mas
                </span>
              </div>
              <ChairArtwork />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="absolute bottom-6 right-7 z-20 h-36 w-20 rounded-[1.35rem] border-[5px] border-[#07080c] bg-[#07080c] shadow-[0_18px_35px_rgba(0,0,0,0.28)]">
      <div className="h-full overflow-hidden rounded-[1rem] bg-white">
        <div className={cn('h-5 bg-gradient-to-r', gradient)} />
        <div className="p-2">
          <CanvasPoster compact />
        </div>
      </div>
    </div>
  </div>
);

const MockupVisual = ({
  variant = 'course',
  gradient = 'from-cyan-500 via-indigo-500 to-violet-600',
  className = '',
}) => {
  if (variant === 'editor') {
    return (
      <div className={className}>
        <EditorMockup gradient={gradient} />
      </div>
    );
  }

  if (variant === 'poster') {
    return (
      <div className={className}>
        <CanvasPoster />
      </div>
    );
  }

  return (
    <div className={className}>
      <DeviceMockup gradient={gradient} />
    </div>
  );
};

export default MockupVisual;
