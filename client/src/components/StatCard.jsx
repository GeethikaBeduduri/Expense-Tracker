/**
 * StatCard — high-density KPI metric display card.
 * Modern fintech styling with neutral surfaces, dark mode support, and restrained color accents.
 */
export default function StatCard({
  id,
  label,
  value,
  caption,
  icon,
  color = 'bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400',
  indicatorText,
  indicatorColor = 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
}) {
  return (
    <div
      id={id}
      className="card relative overflow-hidden flex flex-col justify-between hover:border-surface-300 dark:hover:border-surface-700 hover:shadow-sm transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
          {icon}
        </div>
        {indicatorText && (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${indicatorColor}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
            {indicatorText}
          </span>
        )}
      </div>

      <div className="mt-4">
        <p className="text-[11px] font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white tracking-tight mt-1">
          {value}
        </p>
        {caption && (
          <p className="text-xs text-surface-400 dark:text-surface-500 font-medium mt-1">
            {caption}
          </p>
        )}
      </div>
    </div>
  );
}
