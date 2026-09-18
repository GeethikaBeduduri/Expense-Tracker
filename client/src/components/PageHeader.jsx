/**
 * PageHeader — standardized page header.
 * Clean typography, breadcrumb, subtitle, and action buttons with dark mode support.
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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-surface-200/80 dark:border-surface-800 mb-6">
      <div>
        {breadcrumb && (
          <p className="text-[11px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-1">
            {breadcrumb}
          </p>
        )}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-surface-900 dark:text-white">
            {title}
          </h1>
          {badge && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
              {badge}
            </span>
          )}
        </div>
        {effectiveSubtitle && (
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1 font-normal leading-relaxed">
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
