import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getExpenses, deleteExpense } from '../services/api.js';
import PageHeader from '../components/PageHeader.jsx';
import ExpenseTable from '../components/ExpenseTable.jsx';
import FilterBar from '../components/FilterBar.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import Toast from '../components/Toast.jsx';
import { TableRowSkeleton } from '../components/LoadingSkeleton.jsx';

function Expenses() {
  const location = useLocation();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [toastMessage, setToastMessage] = useState(location.state?.toastMessage || null);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getExpenses();
      setExpenses(response.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to retrieve expenses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense record?')) return;
    setDeletingId(id);
    try {
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((e) => e._id !== id));
      setToastMessage('Expense record deleted successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete expense record.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header (Standardized across pages) ── */}
      <PageHeader
        breadcrumb="Records"
        title="Expenses"
        subtitle="Review, audit, and manage all your recorded financial expenditures."
        badge={!loading && !error ? `${expenses.length} Records` : undefined}
        primaryAction={
          <Link id="add-expense-link" to="/add-expense" className="btn-primary shadow-xs">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Expense
          </Link>
        }
      />

      {/* ── Scaffolded Filter Toolbar (Clearly marked as Phase 2 Roadmap) ── */}
      <FilterBar />

      {/* ── Loading Skeletons ── */}
      {loading && (
        <div className="card p-0 overflow-hidden border border-surface-200">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-50 border-b border-surface-200">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Expense</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Payment Method</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3.5 text-right text-xs font-semibold text-surface-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                <TableRowSkeleton cols={6} />
                <TableRowSkeleton cols={6} />
                <TableRowSkeleton cols={6} />
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Error State ── */}
      {!loading && error && (
        <ErrorState message={error} onRetry={fetchExpenses} />
      )}

      {/* ── Empty State: Zero Records ── */}
      {!loading && !error && expenses.length === 0 && (
        <EmptyState
          title="No expenses recorded yet"
          description="Start tracking your expenditures by recording your first expense. It will be stored in your MongoDB database and summarized on your dashboard."
          action={
            <Link to="/add-expense" className="btn-primary shadow-xs">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Your First Expense
            </Link>
          }
        />
      )}

      {/* ── Populated Table ── */}
      {!loading && !error && expenses.length > 0 && (
        <ExpenseTable
          expenses={expenses}
          onDelete={handleDelete}
          deletingId={deletingId}
        />
      )}

      {/* ── Flash Toast Notification ── */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}

export default Expenses;
