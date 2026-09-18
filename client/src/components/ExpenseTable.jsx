import { Edit2, Trash2, Eye } from 'lucide-react';
import Badge from './Badge.jsx';
import { usePreferences } from '../context/PreferencesContext.jsx';

/**
 * ExpenseTable — high-contrast dark fintech table for financial ledger entries.
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
    <div className="bg-[#0e111a] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left" id="expenses-table">
          <thead>
            <tr className="bg-[#090b11] border-b border-white/[0.08] text-surface-400 text-[11px] font-black uppercase tracking-widest">
              <th className="px-5 py-4">Expense Title</th>
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4">Amount</th>
              <th className="px-5 py-4">Payment</th>
              <th className="px-5 py-4">Date</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05] bg-[#0e111a]">
            {expenses.map((expense) => (
              <tr
                key={expense._id}
                className="hover:bg-white/[0.03] transition-colors duration-100 group"
              >
                {/* Title & Notes */}
                <td className="px-5 py-3.5">
                  <div
                    onClick={() => onView && onView(expense)}
                    className="cursor-pointer"
                  >
                    <p className="font-bold text-white text-sm leading-snug group-hover:text-indigo-300 transition-colors">
                      {expense.title}
                    </p>
                    {expense.description ? (
                      <p className="text-xs text-surface-400 mt-0.5 max-w-xs truncate font-normal">
                        {expense.description}
                      </p>
                    ) : (
                      <p className="text-[11px] text-surface-500 italic mt-0.5">
                        No description attached
                      </p>
                    )}
                  </div>
                </td>

                {/* Category Badge */}
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <Badge category={expense.category} />
                </td>

                {/* Amount */}
                <td className="px-5 py-3.5 whitespace-nowrap font-black font-mono text-emerald-400 text-sm">
                  {formatAmount(expense.amount)}
                </td>

                {/* Payment Method */}
                <td className="px-5 py-3.5 whitespace-nowrap text-surface-400">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/[0.04] text-[11px] font-semibold text-surface-300 border border-white/[0.08]">
                    {expense.paymentMethod}
                  </span>
                </td>

                {/* Date */}
                <td className="px-5 py-3.5 whitespace-nowrap text-surface-400 text-xs font-medium">
                  {formatDate(expense.date)}
                </td>

                {/* Actions */}
                <td className="px-5 py-3.5 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* View Details button */}
                    {onView && (
                      <button
                        onClick={() => onView(expense)}
                        className="p-1.5 rounded-lg text-surface-400 hover:text-white hover:bg-white/[0.08] transition-colors"
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
                        className="p-1.5 rounded-lg text-surface-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
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
                        className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                        title="Delete transaction"
                      >
                        {deletingId === expense._id ? (
                          <span className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin inline-block" />
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
