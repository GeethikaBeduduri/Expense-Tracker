import { Inbox } from 'lucide-react';

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
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 flex items-center justify-center text-surface-400 dark:text-surface-500 mb-4 shrink-0 shadow-xs">
        {icon || <Inbox className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.5]" />}
      </div>

      <h3 className="text-base font-semibold text-surface-900 dark:text-white">{title}</h3>
      {description && (
        <p className="text-sm text-surface-500 dark:text-surface-400 max-w-sm mt-1.5 leading-relaxed">
          {description}
        </p>
      )}

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
