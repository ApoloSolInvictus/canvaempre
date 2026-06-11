const ProgressBar = ({ value = 0, label, compact = false }) => {
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between text-xs font-semibold text-muted">
          <span>{label}</span>
          <span className="text-ink">{safeValue}%</span>
        </div>
      )}
      <div className={compact ? 'h-1.5 rounded-full bg-gray-200' : 'h-2 rounded-full bg-gray-200'}>
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-violet-400 transition-all duration-500"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
