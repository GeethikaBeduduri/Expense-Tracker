import Badge from './Badge.jsx';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatAmount(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount || 0);
}

/**
 * ExpenseTable — modular table view for financial expense records.
 */
export default function ExpenseTable({ expenses, onDelete, deletingId }) {
  return (
    <div className="card p-0 overflow-hidden shadow-xs border border-surface-200">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left" id="expenses-table">
          <thead>
            <tr className="bg-surface-50 border-b border-surface-200">
              <th className="px-6 py-3.5 text-xs font-bold text-surface-600 uppercase tracking-wider">
                Expense
              </th>
              <th className="px-6 py-3.5 text-xs font-bold text-surface-600 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3.5 text-xs font-bold text-surface-600 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3.5 text-xs font-bold text-surface-600 uppercase tracking-wider">
                Payment Method
              </th>
              <th className="px-6 py-3.5 text-xs font-bold text-surface-600 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3.5 text-right text-xs font-bold text-surface-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100 bg-white">
            {expenses.map((expense) => (
              <tr
                key={expense._id}
                className="hover:bg-surface-50/70 transition-colors duration-150 group"
              >
                {/* Title & Notes */}
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold text-surface-900 leading-snug">{expense.title}</p>
                    {expense.description ? (
                      <p className="text-xs text-surface-500 mt-0.5 max-w-xs truncate">
                        {expense.description}
                      </p>
                    ) : (
                      <p className="text-[11px] text-surface-400 italic mt-0.5">No note provided</p>
                    )}
                  </div>
                </td>

                {/* Category Badge */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge category={expense.category} />
                </td>

                {/* Amount */}
                <td className="px-6 py-4 whitespace-nowrap font-bold text-surface-900">
                  {formatAmount(expense.amount)}
                </td>

                {/* Payment Method */}
                <td className="px-6 py-4 whitespace-nowrap text-surface-600">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-surface-100 text-xs font-medium text-surface-700">
                    {expense.paymentMethod}
                  </span>
                </td>

                {/* Date */}
                <td className="px-6 py-4 whitespace-nowrap text-surface-500 text-xs font-medium">
                  {formatDate(expense.date)}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* Phase 2 Edit button (Disabled placeholder) */}
                    <button
                      id={`edit-btn-${expense._id}`}
                      disabled
                      title="Edit capability is scheduled for Phase 2"
                      className="px-2.5 py-1.5 rounded-lg bg-surface-100 text-surface-400 text-xs font-medium cursor-not-allowed border border-surface-200 select-none"
                    >
                      Edit
                    </button>

                    {/* Delete button */}
                    <button
                      id={`delete-btn-${expense._id}`}
                      onClick={() => onDelete(expense._id)}
                      disabled={deletingId === expense._id}
                      className="btn-danger shadow-2xs"
                    >
                      {deletingId === expense._id ? (
                        <span className="inline-flex items-center gap-1">
                          <span className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></span>
                          Deleting...
                        </span>
                      ) : (
                        'Delete'
                      )}
                    </button>
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
