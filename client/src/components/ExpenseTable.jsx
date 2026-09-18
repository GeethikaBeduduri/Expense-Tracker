import { Edit2, Trash2, Eye } from 'lucide-react';
import Badge from './Badge.jsx';
import { usePreferences } from '../context/PreferencesContext.jsx';

/**
 * ExpenseTable — high-density fintech SaaS table for expense records.
 * Supports row inspection, in-place edit modal trigger, and delete confirmation.
 */
export default function ExpenseTable({
  expenses,
  onEdit,
  onDelete,
  onView,
  deletingId,
}) {
  const { formatAmount, formatDate } = usePreferences();

  return (
    <div className="card p-0 overflow-hidden shadow-xs border border-surface-200/80 dark:border-surface-800">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left" id="expenses-table">
          <thead>
            <tr className="bg-surface-50 dark:bg-surface-850 border-b border-surface-200/80 dark:border-surface-800 text-surface-500 dark:text-surface-400 text-xs font-bold uppercase tracking-wider">
              <th className="px-5 py-3.5">Expense</th>
              <th className="px-5 py-3.5">Category</th>
              <th className="px-5 py-3.5">Amount</th>
              <th className="px-5 py-3.5">Payment Method</th>
              <th className="px-5 py-3.5">Date</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100 dark:divide-surface-800 bg-white dark:bg-surface-900">
            {expenses.map((expense) => (
              <tr
                key={expense._id}
                className="hover:bg-surface-50/70 dark:hover:bg-surface-800/50 transition-colors duration-100 group"
              >
                {/* Title & Notes */}
                <td className="px-5 py-3.5">
                  <div
                    onClick={() => onView && onView(expense)}
                    className="cursor-pointer"
                  >
                    <p className="font-semibold text-surface-900 dark:text-white leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {expense.title}
                    </p>
                    {expense.description ? (
                      <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5 max-w-xs truncate">
                        {expense.description}
                      </p>
                    ) : (
                      <p className="text-[11px] text-surface-400 dark:text-surface-600 italic mt-0.5">
                        No note added
                      </p>
                    )}
                  </div>
                </td>

                {/* Category Badge */}
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <Badge category={expense.category} />
                </td>

                {/* Amount */}
                <td className="px-5 py-3.5 whitespace-nowrap font-bold text-surface-900 dark:text-white">
                  {formatAmount(expense.amount)}
                </td>

                {/* Payment Method */}
                <td className="px-5 py-3.5 whitespace-nowrap text-surface-600 dark:text-surface-400">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-surface-100 dark:bg-surface-800 text-xs font-medium text-surface-700 dark:text-surface-300 border border-surface-200/60 dark:border-surface-700">
                    {expense.paymentMethod}
                  </span>
                </td>

                {/* Date */}
                <td className="px-5 py-3.5 whitespace-nowrap text-surface-500 dark:text-surface-400 text-xs font-medium">
                  {formatDate(expense.date)}
                </td>

                {/* Actions */}
                <td className="px-5 py-3.5 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-1 sm:gap-1.5">
                    {/* View Details button */}
                    {onView && (
                      <button
                        onClick={() => onView(expense)}
                        className="p-1.5 rounded-lg text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}

                    {/* Edit button */}
                    {onEdit && (
                      <button
                        id={`edit-btn-${expense._id}`}
                        onClick={() => onEdit(expense)}
                        className="p-1.5 rounded-lg text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                        title="Edit transaction"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}

                    {/* Delete button */}
                    {onDelete && (
                      <button
                        id={`delete-btn-${expense._id}`}
                        onClick={() => onDelete(expense._id)}
                        disabled={deletingId === expense._id}
                        className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete transaction"
                      >
                        {deletingId === expense._id ? (
                          <span className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin inline-block"></span>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
