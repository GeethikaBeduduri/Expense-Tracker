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
      <div className="bg-[#0e111a] border border-white/[0.08] rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-2.5">
          <Calendar className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold tracking-wide uppercase text-zinc-300">
            Reporting Window
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
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                period === item.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/30'
                  : 'bg-[#131722] text-zinc-400 hover:text-white hover:bg-[#1a2030] border border-white/[0.05]'
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
            color="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
            icon={<DollarSign className="w-5 h-5 stroke-[2]" />}
          />
          <StatCard
            label="Transaction Count"
            value={filteredExpenses.length.toLocaleString('en-IN')}
            caption="Entries logged in period"
            color="bg-purple-500/10 text-purple-400 border border-purple-500/20"
            icon={<Receipt className="w-5 h-5 stroke-[2]" />}
          />
          <StatCard
            label="Average Expenditure"
            value={formatAmount(avgExpense)}
            caption="Mean cost per transaction"
            color="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            icon={<TrendingUp className="w-5 h-5 stroke-[2]" />}
          />
        </div>
      )}

      {/* ── Grouped Category Table ── */}
      {!loading && !error && categorySummary.length > 0 && (
        <div className="bg-[#0e111a] border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-5 sm:p-6 border-b border-white/[0.06] flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Category Statement Summary
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Aggregated category volume for the selected window
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {categorySummary.length} Categories
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#121622] text-zinc-400 text-xs font-bold uppercase tracking-wider border-b border-white/[0.06]">
                <tr>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Transactions</th>
                  <th className="px-6 py-4">Total Amount</th>
                  <th className="px-6 py-4">% of Period Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05] bg-[#0e111a]">
                {categorySummary.map((item) => {
                  const pct = totalSpent > 0 ? Math.round((item.total / totalSpent) * 100) : 0;
                  return (
                    <tr key={item.category} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <Badge category={item.category} />
                      </td>
                      <td className="px-6 py-4 text-zinc-300 font-medium">
                        {item.count}
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-white text-base">
                        {formatAmount(item.total)}
                      </td>
                      <td className="px-6 py-4 text-zinc-400 font-mono font-semibold">
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
