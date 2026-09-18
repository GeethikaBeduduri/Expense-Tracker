/**
 * StatCard — Metric display card for high-level numbers.
 * Displays an icon, uppercase category label, ₹ formatted value, caption, and subtle status indicator.
 */
export default function StatCard({
  id,
  label,
  value,
  caption,
  icon,
  color = 'bg-primary-50 text-primary-700',
  indicatorText,
  indicatorColor = 'bg-emerald-50 text-emerald-700 border-emerald-200',
}) {
  return (
    <div id={id} className="card relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between gap-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
          {icon}
        </div>
        {indicatorText && (
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${indicatorColor}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
            {indicatorText}
          </span>
        )}
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider">{label}</p>
        <p className="text-2xl sm:text-3xl font-bold text-surface-900 tracking-tight mt-1">{value}</p>
        {caption && (
          <p className="text-xs text-surface-400 font-medium mt-1">{caption}</p>
        )}
      </div>
    </div>
  );
}
