/**
 * ChartCard — standardized container card for Recharts visualizations.
 */
export default function ChartCard({
  title,
  subtitle,
  action,
  children,
  isEmpty = false,
  emptyMessage = 'No chart data available for the selected period.',
}) {
  return (
    <div className="card flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-surface-100 dark:border-surface-800">
          <div>
            <h2 className="text-base font-bold text-surface-900 dark:text-white">{title}</h2>
            {subtitle && (
              <p className="text-xs text-surface-400 dark:text-surface-500 mt-0.5">{subtitle}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>

        {isEmpty ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-surface-400 dark:text-surface-500">
            <p className="text-sm font-medium text-surface-600 dark:text-surface-400">{emptyMessage}</p>
            <p className="text-xs text-surface-400 dark:text-surface-500 mt-1">
              Data visualizations will appear automatically as you record expenses.
            </p>
          </div>
        ) : (
          <div className="h-64 w-full">{children}</div>
        )}
      </div>
    </div>
  );
}
