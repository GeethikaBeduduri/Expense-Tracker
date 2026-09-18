/**
 * ChartCard — standardized container card for Recharts visualizations with dark fintech aesthetic.
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
    <div className="bg-[#0e111a] border border-white/[0.08] rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
          <div>
            <h2 className="text-base font-extrabold text-white tracking-tight">{title}</h2>
            {subtitle && (
              <p className="text-xs text-surface-400 mt-0.5">{subtitle}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>

        {isEmpty ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-surface-400">
            <p className="text-sm font-bold text-surface-300">{emptyMessage}</p>
            <p className="text-xs text-surface-500 mt-1">
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
