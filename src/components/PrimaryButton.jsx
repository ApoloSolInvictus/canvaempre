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
      'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-soft active:scale-[0.99]',
    secondary:
      'bg-white text-ink ring-1 ring-gray-200 shadow-sm active:scale-[0.99]',
    ghost: 'bg-transparent text-violet hover:bg-violet/5',
  };

  return (
    <button
      type={type}
      className={cn(
        'inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-3xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-55',
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
