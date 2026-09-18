import { useState, useEffect, useCallback } from 'react';
import { Plus, PiggyBank, AlertCircle, CheckCircle, Trash2, Edit2, TrendingUp, X } from 'lucide-react';
import { getBudgets, createBudget, deleteBudget, getExpenses } from '../services/api.js';
import { usePreferences } from '../context/PreferencesContext.jsx';
import PageHeader from '../components/PageHeader.jsx';
import StatCard from '../components/StatCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import Toast from '../components/Toast.jsx';

const BUDGET_CATEGORIES = [
  'Monthly Total',
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
  'Education',
  'Other',
];

export default function Budgets() {
  const { formatAmount, currencySymbol } = usePreferences();
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [category, setCategory] = useState('Monthly Total');
  const [monthlyLimit, setMonthlyLimit] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Delete State
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, title: '' });
  const [deleting, setDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const fetchBudgetData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getBudgets();
      setBudgets(response.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load budget plans.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBudgetData();
  }, [fetchBudgetData]);

  const [formError, setFormError] = useState(null);
  const [toast, setToast] = useState(null); // { message, type }

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!monthlyLimit || Number(monthlyLimit) <= 0) {
      setFormError(`Please enter a valid budget limit greater than ${currencySymbol}0.`);
      return;
    }

    setSubmitting(true);
    try {
      await createBudget({
        category,
        monthlyLimit: Number(monthlyLimit),
      });
      setModalOpen(false);
      setMonthlyLimit('');
      setCategory('Monthly Total');
      fetchBudgetData();
      setToast({ message: `Budget for ${category} saved successfully`, type: 'success' });
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save budget plan.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.id) return;
    setDeleting(true);
    try {
      await deleteBudget(deleteDialog.id);
      setBudgets((prev) => prev.filter((b) => b._id !== deleteDialog.id));
      setDeleteDialog({ isOpen: false, id: null, title: '' });
      setToast({ message: 'Budget limit removed successfully', type: 'success' });
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to delete budget.', type: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  // Aggregated totals
  const totalBudgeted = budgets.reduce((sum, b) => sum + (Number(b.monthlyLimit) || 0), 0);
  const totalSpentAcrossBudgets = budgets.reduce((sum, b) => sum + (Number(b.spent) || 0), 0);

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <PageHeader
        breadcrumb="Planning"
        title="Budgets"
        subtitle="Set spending limits per category, track burn velocity, and protect your financial health."
        primaryAction={
          <button
            onClick={() => setModalOpen(true)}
            className="btn-primary shadow-xs font-semibold"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Budget</span>
          </button>
        }
      />

      {/* ── Error State ── */}
      {!loading && error && (
        <ErrorState message={error} onRetry={fetchBudgetData} />
      )}

      {/* ── Summary Cards ── */}
      {!loading && !error && budgets.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Total Allocated"
            value={formatAmount(totalBudgeted)}
            caption="Sum of all active budget limits"
            color="bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400"
            icon={<PiggyBank className="w-5 h-5 stroke-[2]" />}
          />
          <StatCard
            label="Budget Burn"
            value={formatAmount(totalSpentAcrossBudgets)}
            caption="Real expenditure charged against budgets"
            color="bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400"
            icon={<TrendingUp className="w-5 h-5 stroke-[2]" />}
          />
          <StatCard
            label="Remaining Balance"
            value={formatAmount(Math.max(0, totalBudgeted - totalSpentAcrossBudgets))}
            caption="Unallocated spending headroom"
            indicatorText={totalSpentAcrossBudgets > totalBudgeted ? 'Exceeded' : 'On Track'}
            indicatorColor={
              totalSpentAcrossBudgets > totalBudgeted
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }
            color="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400"
            icon={<CheckCircle className="w-5 h-5 stroke-[2]" />}
          />
        </div>
      )}

      {/* ── Empty State ── */}
      {!loading && !error && budgets.length === 0 && (
        <EmptyState
          icon={<PiggyBank className="w-7 h-7" />}
          title="No budget targets set"
          description="Create your first budget limit to start monitoring category burn rates against actual spending."
          action={
            <button
              onClick={() => setModalOpen(true)}
              className="btn-primary text-xs py-2 px-4 shadow-xs font-semibold"
            >
              <Plus className="w-4 h-4" />
              Set First Budget
            </button>
          }
        />
      )}

      {/* ── Budget Cards Grid ── */}
      {!loading && !error && budgets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {budgets.map((b) => {
            const pct = Math.min(b.percentage, 100);
            let barColor = 'bg-emerald-500';
            let tagColor = 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800';

            if (b.percentage >= 90 || b.isExceeded) {
              barColor = 'bg-rose-500';
              tagColor = 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800';
            } else if (b.percentage >= 70) {
              barColor = 'bg-amber-500';
              tagColor = 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800';
            }

            return (
              <div
                key={b._id}
                className="card p-5 border border-surface-200/80 dark:border-surface-800 hover:border-surface-300 dark:hover:border-surface-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-surface-100 dark:border-surface-800">
                    <div>
                      <h3 className="text-base font-bold text-surface-900 dark:text-white">
                        {b.category}
                      </h3>
                      <p className="text-xs text-surface-400 dark:text-surface-500">
                        Monthly Allowance
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        setDeleteDialog({
                          isOpen: true,
                          id: b._id,
                          title: `budget for ${b.category}`,
                        })
                      }
                      className="p-1.5 rounded-lg text-surface-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                      title="Delete budget limit"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Limit & Spent */}
                  <div className="mt-4 flex items-baseline justify-between">
                    <div>
                      <p className="text-xs text-surface-400 dark:text-surface-500">Spent</p>
                      <p className="text-lg font-bold text-surface-900 dark:text-white">
                        {formatAmount(b.spent)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-surface-400 dark:text-surface-500">Target Limit</p>
                      <p className="text-sm font-semibold text-surface-700 dark:text-surface-300">
                        {formatAmount(b.monthlyLimit)}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="w-full bg-surface-100 dark:bg-surface-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Footer Tag */}
                <div className="mt-5 pt-3 border-t border-surface-100 dark:border-surface-800 flex items-center justify-between text-xs">
                  <span className={`px-2 py-0.5 rounded-md font-semibold border ${tagColor}`}>
                    {b.percentage}% Used
                  </span>
                  <span className="text-surface-500 dark:text-surface-400 font-medium">
                    {b.remaining >= 0 ? `${formatAmount(b.remaining)} left` : `${formatAmount(Math.abs(b.remaining))} over budget`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Create / Update Budget Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="card w-full max-w-md p-6 bg-white dark:bg-surface-900 shadow-2xl border border-surface-200 dark:border-surface-800 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3.5 border-b border-surface-100 dark:border-surface-800">
              <h3 className="text-base font-bold text-surface-900 dark:text-white">
                Set Budget Limit
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 p-1.5 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="mt-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveBudget} className="mt-4 space-y-4">
              <div>
                <label className="form-label">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-input text-sm"
                >
                  {BUDGET_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Monthly Limit</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-surface-500 font-semibold text-sm">
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    placeholder="e.g. 5000"
                    value={monthlyLimit}
                    onChange={(e) => setMonthlyLimit(e.target.value)}
                    required
                    className="form-input pl-8 text-sm"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-surface-100 dark:border-surface-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-secondary text-xs py-2 px-3.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary text-xs py-2 px-4 shadow-sm"
                >
                  {submitting ? 'Saving...' : 'Set Budget'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Confirm Delete Dialog ── */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Budget Target"
        message={`Are you sure you want to remove the ${deleteDialog.title}? Your expenses will remain intact.`}
        confirmText="Remove Budget"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, id: null, title: '' })}
        loading={deleting}
      />

      {/* ── Toast ── */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
