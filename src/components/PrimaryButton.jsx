import { Loader2 } from 'lucide-react';
import { cn } from '../lib/cn';

const PrimaryButton = ({
  children,
  className = '',
  loading = false,
  variant = 'primary',
  type = 'button',
  ...props
}) => {
  const variants = {
    primary:
      'bg-[linear-gradient(90deg,#5B3DF4_0%,#7B2DFF_100%)] text-white shadow-soft active:scale-[0.99]',
    secondary:
      'bg-white text-ink ring-1 ring-gray-200 shadow-sm active:scale-[0.99]',
    ghost: 'bg-transparent text-violet hover:bg-violet/5',
  };

  return (
    <button
      type={type}
      className={cn(
        'inline-flex min-h-[58px] w-full items-center justify-center gap-3 rounded-[1.35rem] px-5 py-4 text-lg font-bold transition disabled:cursor-not-allowed disabled:opacity-55',
        variants[variant],
        className,
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};

export default PrimaryButton;
