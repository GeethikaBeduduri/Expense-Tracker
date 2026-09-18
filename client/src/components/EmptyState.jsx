import { Inbox } from 'lucide-react';

/**
 * EmptyState — cinematic dark fintech empty state with subtle radial gradient.
 */
export default function EmptyState({
  icon,
  title = 'No records found',
  description = 'Get started by adding your first entry.',
  action,
  compact = false,
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#121520] to-[#090b11] border border-white/[0.08] flex flex-col items-center justify-center text-center ${
        compact ? 'py-10 px-5' : 'py-16 px-6'
      }`}
    >
      {/* Background subtle radial ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/[0.04] rounded-full blur-3xl pointer-events-none" />

      {/* Large elegant icon */}
      <div className="relative z-10 w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.1] shadow-xl shadow-indigo-950/40 flex items-center justify-center text-indigo-400 mb-4 shrink-0">
        {icon || <Inbox className="w-7 h-7 stroke-[1.8]" />}
      </div>

      <h3 className="relative z-10 text-base sm:text-lg font-bold text-white tracking-tight">
        {title}
      </h3>
      {description && (
        <p className="relative z-10 text-xs sm:text-sm text-surface-400 max-w-md mt-2 leading-relaxed font-normal">
          {description}
        </p>
      )}

      {action && <div className="relative z-10 mt-6">{action}</div>}
    </div>
  );
}
