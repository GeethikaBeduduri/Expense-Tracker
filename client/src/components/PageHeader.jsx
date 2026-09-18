/**
 * PageHeader — reusable header for Dashboard, Expenses, and Add Expense.
 * Standardizes title, subtitle, breadcrumb indicator, primary action, and secondary action.
 */
export default function PageHeader({
  title,
  subtitle,
  description,
  breadcrumb,
  badge,
  primaryAction,
  secondaryAction,
  action, // backwards compatibility
}) {
  const effectiveSubtitle = subtitle || description;
  const effectiveAction = primaryAction || action;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-surface-200/60 mb-6">
      <div>
        {breadcrumb && (
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-wider mb-1">
            {breadcrumb}
          </p>
        )}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-surface-900">{title}</h1>
          {badge && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-200">
              {badge}
            </span>
          )}
        </div>
        {effectiveSubtitle && (
          <p className="text-sm text-surface-500 mt-1 font-normal leading-relaxed">
            {effectiveSubtitle}
          </p>
        )}
      </div>

      {(effectiveAction || secondaryAction) && (
        <div className="shrink-0 flex items-center gap-3">
          {secondaryAction}
          {effectiveAction}
        </div>
      )}
    </div>
  );
}
