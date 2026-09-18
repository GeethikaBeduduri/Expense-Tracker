import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Wallet,
  Calendar,
  Receipt,
  TrendingUp,
  Plus,
  ArrowRight,
  PieChart as PieIcon,
  Activity,
  FileSpreadsheet,
  PiggyBank,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { getExpenses } from '../services/api.js';
import { usePreferences } from '../context/PreferencesContext.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Badge from '../components/Badge.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import ExpenseModal from '../components/ExpenseModal.jsx';
import Toast from '../components/Toast.jsx';

const CATEGORY_COLORS = {
  Food: '#f59e0b',
  Transport: '#3b82f6',
  Shopping: '#a855f7',
  Bills: '#f43f5e',
  Entertainment: '#6366f1',
  Health: '#10b981',
  Education: '#06b6d4',
  Other: '#64748b',
};

function Dashboard() {
  const navigate = useNavigate();
  const { formatAmount, formatDate, currencySymbol } = usePreferences();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states for inspecting and adding expenses
  const [modalState, setModalState] = useState({ isOpen: false, mode: 'add', data: null });
  const [toastMessage, setToastMessage] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getExpenses();
      setExpenses(response.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unable to retrieve financial records from server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Aggregate statistics strictly from actual database records
  const stats = useMemo(() => {
    const total = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const count = expenses.length;
    const average = count > 0 ? total / count : 0;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const thisMonthTotal = expenses
      .filter((item) => {
        const d = new Date(item.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

    const monthName = now.toLocaleString('default', { month: 'long' });

    return {
      totalFormatted: formatAmount(total),
      thisMonthFormatted: formatAmount(thisMonthTotal),
      countFormatted: count.toLocaleString('en-IN'),
      averageFormatted: formatAmount(average),
      monthName,
      rawTotal: total,
      rawCount: count,
    };
  }, [expenses, formatAmount]);

  // Timeline data for Hero AreaChart
  const timelineData = useMemo(() => {
    if (expenses.length === 0) return [];

    const monthMap = {};
    expenses.forEach((item) => {
      const d = new Date(item.date);
      const key = d.toLocaleString('en-IN', { month: 'short', year: '2-digit' });
      monthMap[key] = (monthMap[key] || 0) + Number(item.amount);
    });

    return Object.entries(monthMap).map(([name, amount]) => ({
      name,
      amount: Math.round(amount),
    }));
  }, [expenses]);

  // Category distribution for Donut Chart
  const categoryPieData = useMemo(() => {
    if (expenses.length === 0) return [];

    const catMap = {};
    expenses.forEach((item) => {
      catMap[item.category] = (catMap[item.category] || 0) + Number(item.amount);
    });

    const total = Object.values(catMap).reduce((a, b) => a + b, 0);

    return Object.entries(catMap)
      .map(([name, value]) => ({
        name,
        value: Math.round(value),
        percentage: total > 0 ? Math.round((value / total) * 100) : 0,
        color: CATEGORY_COLORS[name] || CATEGORY_COLORS.Other,
      }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  const recentTransactions = useMemo(() => {
    return [...expenses].slice(0, 5);
  }, [expenses]);

  const handleModalSuccess = (savedExpense, actionType) => {
    fetchDashboardData();
    setToastMessage(`Expense ${actionType === 'added' ? 'recorded' : 'updated'} successfully`);
  };

  return (
    <div className="space-y-8">
      {/* ── Page Header ── */}
      <PageHeader
        breadcrumb="Executive Financial Overview"
        title="Command Center"
        subtitle="Your real-time personal finance picture, spending velocity, and category allocations synced with MongoDB Atlas."
        primaryAction={
          <button
            onClick={() => setModalState({ isOpen: true, mode: 'add', data: null })}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Record Expense</span>
          </button>
        }
      />

      {/* ── Error State ── */}
      {!loading && error && (
        <ErrorState
          title="Connection Error"
          message={error}
          onRetry={fetchDashboardData}
        />
      )}

      {/* ── HERO ROW: Asymmetrical Financial Showcase ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Hero Panel (8 Cols on LG) */}
        <div className="lg:col-span-8 bg-gradient-to-br from-[#10131d] via-[#0c0e15] to-[#090b10] border border-white/[0.09] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/[0.07] rounded-full blur-3xl pointer-events-none" />

          {/* Top Row: Label & Status Indicator */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400" />
              <span className="text-[11px] font-black uppercase tracking-widest text-indigo-400">
                Total Expenditure
              </span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-extrabold tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE MONGODB SYNC
            </div>
          </div>

          {/* Big Editorial Number */}
          <div className="relative z-10 my-6">
            <p className="text-4xl sm:text-6xl font-black tracking-tight text-white font-mono">
              {stats.totalFormatted}
            </p>
            <p className="text-xs sm:text-sm text-surface-400 mt-2 font-normal">
              Based on your actual verified financial records in MongoDB.
            </p>
          </div>

          {/* Compact 3-Pill Stat Strip */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 stroke-[2]" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-surface-400 font-bold">
                  {stats.monthName}
                </p>
                <p className="text-sm font-bold text-white font-mono truncate">
                  {stats.thisMonthFormatted}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <Receipt className="w-4 h-4 stroke-[2]" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-surface-400 font-bold">
                  Transactions
                </p>
                <p className="text-sm font-bold text-white font-mono truncate">
                  {stats.countFormatted} entries
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4 stroke-[2]" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-surface-400 font-bold">
                  Average Ticket
                </p>
                <p className="text-sm font-bold text-white font-mono truncate">
                  {stats.averageFormatted}
                </p>
              </div>
            </div>
          </div>

          {/* Integrated Visual Chart Area */}
          <div className="relative z-10 pt-4 border-t border-white/[0.06]">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-surface-300">Spending Velocity Curve</span>
              <span className="text-surface-500 text-[11px]">Monthly Aggregate</span>
            </div>

            {timelineData.length > 0 ? (
              <div className="h-48 sm:h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="heroGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="name"
                      stroke="#475569"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#475569"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `${currencySymbol}${v}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0c0e15',
                        borderColor: 'rgba(255, 255, 255, 0.12)',
                        borderRadius: '12px',
                        color: '#ffffff',
                        fontSize: '12px',
                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
                      }}
                      formatter={(value) => [`${currencySymbol}${value}`, 'Spent']}
                    />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#818cf8"
                      strokeWidth={2.5}
                      fill="url(#heroGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="py-10 text-center rounded-2xl bg-white/[0.02] border border-dashed border-white/[0.08]">
                <Activity className="w-8 h-8 text-surface-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-surface-300">No Spending History</p>
                <p className="text-xs text-surface-500 max-w-sm mx-auto mt-1">
                  Start tracking your spending to activate your velocity chart.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Category Allocation Panel (4 Cols on LG) */}
        <div className="lg:col-span-4 bg-[#0e111a] border border-white/[0.09] rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">
                  Category Allocation
                </h2>
                <p className="text-xs text-surface-400 mt-0.5">
                  Spending share by category
                </p>
              </div>
              <Link
                to="/analytics"
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Analytics →
              </Link>
            </div>

            {categoryPieData.length > 0 ? (
              <div>
                {/* Donut Chart */}
                <div className="h-52 w-full my-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={58}
                        outerRadius={82}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {categoryPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="#0e111a" strokeWidth={2} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0c0e15',
                          borderColor: 'rgba(255, 255, 255, 0.12)',
                          borderRadius: '10px',
                          color: '#ffffff',
                          fontSize: '11px',
                        }}
                        formatter={(value) => [`${currencySymbol}${value}`, 'Spent']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Top Category List */}
                <div className="space-y-2.5 mt-4">
                  {categoryPieData.slice(0, 4).map((cat) => (
                    <div
                      key={cat.name}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="font-semibold text-white truncate">
                          {cat.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] font-bold text-surface-400">
                          {cat.percentage}%
                        </span>
                        <span className="font-mono font-bold text-white">
                          {formatAmount(cat.value)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-14 text-center">
                <PieIcon className="w-9 h-9 text-surface-600 mx-auto mb-2.5 stroke-[1.5]" />
                <p className="text-sm font-bold text-surface-300">No Category Data</p>
                <p className="text-xs text-surface-500 mt-1 max-w-xs mx-auto">
                  Category breakdown will populate here once transactions are recorded.
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 mt-6 border-t border-white/[0.06] text-center">
            <Link
              to="/budgets"
              className="text-xs font-semibold text-surface-400 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
            >
              <PiggyBank className="w-3.5 h-3.5 text-indigo-400" />
              <span>Configure category budget limits →</span>
            </Link>
          </div>
        </div>

      </div>

      {/* ── ROW 2: Recent Ledger & Quick Shortcuts (Asymmetric) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Transactions Ledger (8 Cols on LG) */}
        <div className="lg:col-span-8 bg-[#0e111a] border border-white/[0.09] rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">
                  Recent Transactions
                </h2>
                <p className="text-xs text-surface-400 mt-0.5">
                  Latest ledger expenditures synced with MongoDB
                </p>
              </div>
              {expenses.length > 0 && (
                <Link
                  to="/expenses"
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                >
                  <span>View All ({expenses.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            {recentTransactions.length > 0 ? (
              <div className="divide-y divide-white/[0.05]">
                {recentTransactions.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => setModalState({ isOpen: true, mode: 'view', data: item })}
                    className="py-3.5 flex items-center justify-between gap-4 hover:bg-white/[0.03] rounded-2xl px-3 transition-colors cursor-pointer"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge category={item.category} />
                        <span className="text-xs text-surface-400">
                          {formatDate(item.date)}
                        </span>
                        <span className="text-xs text-surface-500 hidden sm:inline">
                          · {item.paymentMethod}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-sm sm:text-base font-black font-mono text-emerald-400">
                        {formatAmount(item.amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                compact
                title="No expenses recorded yet"
                description="Start tracking your spending to see your financial insights here."
                action={
                  <button
                    onClick={() => setModalState({ isOpen: true, mode: 'add', data: null })}
                    className="btn-primary text-xs py-2 px-4 shadow-lg shadow-indigo-600/25"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Record First Expense
                  </button>
                }
              />
            )}
          </div>

          {recentTransactions.length > 0 && (
            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-surface-400">
              <span>Showing {recentTransactions.length} of {expenses.length} records</span>
              <Link
                to="/expenses"
                className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors"
              >
                Manage full ledger →
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions & Workspace Panel (4 Cols on LG) */}
        <div className="lg:col-span-4 bg-[#0e111a] border border-white/[0.09] rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="pb-4 border-b border-white/[0.08] mb-4">
              <h2 className="text-base font-bold text-white tracking-tight">
                Quick Shortcuts
              </h2>
              <p className="text-xs text-surface-400 mt-0.5">
                Rapid personal finance operations
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setModalState({ isOpen: true, mode: 'add', data: null })}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-indigo-500/30 text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Record Transaction</p>
                    <p className="text-[11px] text-surface-400">Post entry to ledger</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-surface-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </button>

              <Link
                to="/expenses"
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-indigo-500/30 text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Receipt className="w-4 h-4 stroke-[2]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Browse Ledger</p>
                    <p className="text-[11px] text-surface-400">Search, filter & sort</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-surface-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                to="/reports"
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-indigo-500/30 text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <FileSpreadsheet className="w-4 h-4 stroke-[2]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Export Audit CSV</p>
                    <p className="text-[11px] text-surface-400">Spreadsheet-ready data</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-surface-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </Link>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 mt-6">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
              <Zap className="w-4 h-4 text-indigo-400" />
              Real Data Guarantee
            </div>
            <p className="text-[11px] text-surface-400 mt-1 leading-relaxed">
              Every chart and calculation is computed live from MongoDB Atlas. No mock arrays or static samples.
            </p>
          </div>
        </div>

      </div>

      {/* ── Transaction Modal (Add / Edit / View) ── */}
      <ExpenseModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        expenseData={modalState.data}
        onClose={() => setModalState({ isOpen: false, mode: 'add', data: null })}
        onSuccess={handleModalSuccess}
      />

      {/* ── Toast Notification ── */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}

export default Dashboard;
