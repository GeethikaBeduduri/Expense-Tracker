import { useState, useEffect, useCallback, useMemo } from 'react';
import { Download, FileText, Calendar, Filter, DollarSign, Receipt, TrendingUp } from 'lucide-react';
import { getExpenses } from '../services/api.js';
import { usePreferences } from '../context/PreferencesContext.jsx';
import PageHeader from '../components/PageHeader.jsx';
import StatCard from '../components/StatCard.jsx';
import Badge from '../components/Badge.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import Toast from '../components/Toast.jsx';

export default function Reports() {
  const { formatAmount, formatDate, currencySymbol } = usePreferences();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('all'); // 'all' | 'this_month' | 'last_month' | 'ytd'
  const [toast, setToast] = useState(null);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getExpenses();
      setExpenses(res.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to generate report.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Filter expenses by selected period
  const filteredExpenses = useMemo(() => {
    const now = new Date();
    return expenses.filter((e) => {
      const d = new Date(e.date);
      if (period === 'this_month') {
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }
      if (period === 'last_month') {
        const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
        const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
        return d.getMonth() === lastMonth && d.getFullYear() === year;
      }
      if (period === 'ytd') {
        return d.getFullYear() === now.getFullYear();
      }
      return true; // 'all'
    });
  }, [expenses, period]);

  // Category breakdown for filtered period
  const categorySummary = useMemo(() => {
    const map = {};
    filteredExpenses.forEach((e) => {
      if (!map[e.category]) {
        map[e.category] = { count: 0, total: 0 };
      }
      map[e.category].count += 1;
      map[e.category].total += Number(e.amount);
    });

    return Object.entries(map)
      .map(([cat, info]) => ({
        category: cat,
        count: info.count,
        total: info.total,
      }))
      .sort((a, b) => b.total - a.total);
  }, [filteredExpenses]);

  const totalSpent = filteredExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const avgExpense = filteredExpenses.length > 0 ? totalSpent / filteredExpenses.length : 0;

  // Real 1-Click CSV Export Function
  const exportToCSV = () => {
    if (filteredExpenses.length === 0) {
      setToast({ message: 'No expense records available to export.', type: 'error' });
      return;
    }

    const headers = ['Transaction ID', 'Title', 'Category', 'Amount', 'Payment Method', 'Date', 'Notes'];
    const rows = filteredExpenses.map((e) => [
      `"${e._id}"`,
      `"${(e.title || '').replace(/"/g, '""')}"`,
      `"${e.category}"`,
      e.amount,
      `"${e.paymentMethod}"`,
      `"${new Date(e.date).toISOString().split('T')[0]}"`,
      `"${(e.description || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const dateStr = new Date().toISOString().split('T')[0];
    link.href = url;
    link.setAttribute('download', `ExpenseTracker_Report_${period}_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setToast({ message: 'CSV report downloaded successfully.', type: 'success' });
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <PageHeader
        breadcrumb="Data & Exports"
        title="Reports"
        subtitle="Generate fiscal summaries, category audit statements, and export ledger records to CSV."
        primaryAction={
          <button
            onClick={exportToCSV}
            disabled={filteredExpenses.length === 0}
            className="btn-primary shadow-xs font-semibold"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Export CSV</span>
          </button>
        }
      />

      {/* ── Period Selector Toolbar ── */}
      <div className="card p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-surface-200/80 dark:border-surface-800">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-surface-400" />
          <span className="text-xs font-semibold text-surface-700 dark:text-surface-300">
            Reporting Window:
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All Records' },
            { id: 'this_month', label: 'This Month' },
            { id: 'last_month', label: 'Last Month' },
            { id: 'ytd', label: 'Year-to-Date' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setPeriod(item.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                period === item.id
                  ? 'bg-primary-600 text-white shadow-2xs'
                  : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200/60 dark:hover:bg-surface-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Error State ── */}
      {!loading && error && (
        <ErrorState message={error} onRetry={fetchExpenses} />
      )}

      {/* ── Empty State ── */}
      {!loading && !error && filteredExpenses.length === 0 && (
        <EmptyState
          icon={<FileText className="w-7 h-7" />}
          title="No records found for this period"
          description="Try selecting a different reporting window to generate summary tables."
        />
      )}

      {/* ── Summary Stats ── */}
      {!loading && !error && filteredExpenses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Total Period Spend"
            value={formatAmount(totalSpent)}
            caption="Sum of transactions in window"
            color="bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400"
            icon={<DollarSign className="w-5 h-5 stroke-[2]" />}
          />
          <StatCard
            label="Transaction Count"
            value={filteredExpenses.length.toLocaleString('en-IN')}
            caption="Entries logged in period"
            color="bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400"
            icon={<Receipt className="w-5 h-5 stroke-[2]" />}
          />
          <StatCard
            label="Average Expenditure"
            value={formatAmount(avgExpense)}
            caption="Mean cost per transaction"
            color="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400"
            icon={<TrendingUp className="w-5 h-5 stroke-[2]" />}
          />
        </div>
      )}

      {/* ── Grouped Category Table ── */}
      {!loading && !error && categorySummary.length > 0 && (
        <div className="card p-0 overflow-hidden shadow-xs border border-surface-200/80 dark:border-surface-800">
          <div className="p-4 border-b border-surface-200/80 dark:border-surface-800 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-surface-900 dark:text-white">
                Category Statement Summary
              </h3>
              <p className="text-xs text-surface-400 dark:text-surface-500">
                Aggregated category volume for the selected window
              </p>
            </div>
            <span className="text-xs font-semibold text-surface-500 dark:text-surface-400">
              {categorySummary.length} Active Categories
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-surface-50 dark:bg-surface-850 text-surface-500 dark:text-surface-400 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Transactions</th>
                  <th className="px-5 py-3">Total Amount</th>
                  <th className="px-5 py-3">% of Period Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-surface-800 bg-white dark:bg-surface-900">
                {categorySummary.map((item) => {
                  const pct = totalSpent > 0 ? Math.round((item.total / totalSpent) * 100) : 0;
                  return (
                    <tr key={item.category} className="hover:bg-surface-50/70 dark:hover:bg-surface-800/50">
                      <td className="px-5 py-3.5">
                        <Badge category={item.category} />
                      </td>
                      <td className="px-5 py-3.5 text-surface-600 dark:text-surface-400 font-medium">
                        {item.count}
                      </td>
                      <td className="px-5 py-3.5 font-bold text-surface-900 dark:text-white">
                        {formatAmount(item.total)}
                      </td>
                      <td className="px-5 py-3.5 text-surface-600 dark:text-surface-400 font-semibold">
                        {pct}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Toast Notification ── */}
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
