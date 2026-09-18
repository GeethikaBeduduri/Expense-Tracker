/**
 * PageHeader — bold, editorial dark fintech page header.
 */
export default function PageHeader({
  title,
  subtitle,
  description,
  breadcrumb,
  badge,
  primaryAction,
  secondaryAction,
  action,
}) {
  const effectiveSubtitle = subtitle || description;
  const effectiveAction = primaryAction || action;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-white/[0.08] mb-6">
      <div>
        {breadcrumb && (
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500"></span>
            <p className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest">
              {breadcrumb}
            </p>
          </div>
        )}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {title}
          </h1>
          {badge && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              {badge}
            </span>
          )}
        </div>
        {effectiveSubtitle && (
          <p className="text-xs sm:text-sm text-surface-400 mt-1 font-normal leading-relaxed max-w-2xl">
            {effectiveSubtitle}
          </p>
        )}
      </div>

      {(effectiveAction || secondaryAction) && (
        <div className="shrink-0 flex items-center gap-2.5">
          {secondaryAction}
          {effectiveAction}
        </div>
      )}
    </div>
  );
}
