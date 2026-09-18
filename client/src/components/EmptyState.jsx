/**
 * EmptyState — used when tables, lists, or widgets have no records yet.
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
      className={`card flex flex-col items-center justify-center text-center ${
        compact ? 'py-8 px-4' : 'py-16 px-6'
      }`}
    >
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-surface-100 border border-surface-200 flex items-center justify-center text-surface-400 mb-4 shrink-0 shadow-xs">
        {icon || (
          <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        )}
      </div>

      <h3 className="text-base font-semibold text-surface-800">{title}</h3>
      {description && (
        <p className="text-sm text-surface-500 max-w-sm mt-1.5 leading-relaxed">{description}</p>
      )}

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
