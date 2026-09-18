/**
 * StatCard — high-density dark fintech KPI metric display card.
 */
export default function StatCard({
  id,
  label,
  value,
  caption,
  icon,
  color = 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
  indicatorText,
  indicatorColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
}) {
  return (
    <div
      id={id}
      className="bg-[#0e111a] border border-white/[0.08] hover:border-white/[0.16] rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-4">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${color}`}>
          {icon}
        </div>
        {indicatorText && (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${indicatorColor}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
            {indicatorText}
          </span>
        )}
      </div>

      <div className="mt-4">
        <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">
          {label}
        </p>
        <p className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono mt-1">
          {value}
        </p>
        {caption && (
          <p className="text-xs text-surface-500 mt-1 font-normal">
            {caption}
          </p>
        )}
      </div>
    </div>
  );
}
