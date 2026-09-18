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
  LineChart as ChartIcon,
  PiggyBank,
} from 'lucide-react';
import { getExpenses } from '../services/api.js';
import { usePreferences } from '../context/PreferencesContext.jsx';
import PageHeader from '../components/PageHeader.jsx';
import StatCard from '../components/StatCard.jsx';
import Badge from '../components/Badge.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import ChartCard from '../components/ChartCard.jsx';
import ExpenseModal from '../components/ExpenseModal.jsx';
import Toast from '../components/Toast.jsx';
import { StatCardSkeleton } from '../components/LoadingSkeleton.jsx';

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

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function Dashboard() {
  const navigate = useNavigate();
  const { formatAmount, formatDate, currencySymbol } = usePreferences();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [modalState, setModalState] = useState({ isOpen: false, mode: 'add', data: null });
  const [toastMessage, setToastMessage] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getExpenses();
      setExpenses(response.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unable to retrieve dashboard financial data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Aggregate summary metrics strictly from database records
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

    const monthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });

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

  // Spending over time (monthly aggregation for AreaChart)
  const monthlyTimelineData = useMemo(() => {
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

    return Object.entries(catMap).map(([name, value]) => ({
      name,
      value: Math.round(value),
      color: CATEGORY_COLORS[name] || CATEGORY_COLORS.Other,
    }));
  }, [expenses]);

  const recentTransactions = useMemo(() => {
    return [...expenses].slice(0, 5);
  }, [expenses]);

  const handleModalSuccess = (savedExpense, actionType) => {
    fetchDashboardData();
    setToastMessage(`Transaction ${actionType === 'added' ? 'recorded' : 'updated'} successfully`);
  };

  return (
    <div className="space-y-6">
      {/* ── Dashboard Page Header ── */}
      <PageHeader
        breadcrumb="Executive Overview"
        title={`${getGreeting()}, Welcome`}
        subtitle="Here is a high-level summary of your personal finances, spending velocity, and category allocations."
        primaryAction={
          <button
            onClick={() => setModalState({ isOpen: true, mode: 'add', data: null })}
            className="btn-primary shadow-xs font-semibold"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Expense</span>
          </button>
        }
      />

      {/* ── Error State (if API fails) ── */}
      {!loading && error && (
        <ErrorState
          title="Dashboard Unavailable"
          message={error}
          onRetry={fetchDashboardData}
        />
      )}

      {/* ── ROW 1: 4 Key Metric Cards ── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            id="kpi-total-spending"
            label="Total Spending"
            value={stats.totalFormatted}
            caption="Cumulative expenses to date"
            indicatorText="All Time"
            color="bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400"
            icon={<Wallet className="w-5 h-5 stroke-[2]" />}
          />

          <StatCard
            id="kpi-this-month"
            label="This Month"
            value={stats.thisMonthFormatted}
            caption={`Recorded in ${stats.monthName}`}
            indicatorText="Active Month"
            color="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400"
            icon={<Calendar className="w-5 h-5 stroke-[2]" />}
          />

          <StatCard
            id="kpi-transactions"
            label="Transactions"
            value={stats.countFormatted}
            caption="Total entries stored in database"
            indicatorText={`${stats.rawCount} items`}
            indicatorColor="bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800"
            color="bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400"
            icon={<Receipt className="w-5 h-5 stroke-[2]" />}
          />

          <StatCard
            id="kpi-average"
            label="Average Expense"
            value={stats.averageFormatted}
            caption="Mean cost per recorded entry"
            indicatorText="Per Record"
            indicatorColor="bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800"
            color="bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400"
            icon={<TrendingUp className="w-5 h-5 stroke-[2]" />}
          />
        </div>
      )}

      {/* ── ROW 2: Interactive Real Charts (Recharts) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spending Over Time (Area Chart - 2 cols) */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Spending Velocity"
            subtitle="Monthly cumulative burn rate based on actual transaction dates"
            isEmpty={!loading && monthlyTimelineData.length === 0}
            emptyMessage="No spending history recorded yet."
            action={
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300">
                Timeline
              </span>
            }
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTimelineData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${currencySymbol}${v}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(value) => [`${currencySymbol}${value}`, 'Spent']}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#spendingGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Category Breakdown (Donut Chart - 1 col) */}
        <div className="lg:col-span-1">
          <ChartCard
            title="Category Allocation"
            subtitle="Distribution of expenditure across categories"
            isEmpty={!loading && categoryPieData.length === 0}
            emptyMessage="No category data available."
            action={
              <Link
                to="/analytics"
                className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline"
              >
                Analytics →
              </Link>
            }
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(value) => [`${currencySymbol}${value}`, 'Total']}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* ── ROW 3: Recent Transactions & Quick Actions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions Stream (2 cols) */}
        <div className="card lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-surface-100 dark:border-surface-800">
              <div>
                <h2 className="text-base font-bold text-surface-900 dark:text-white">
                  Recent Transactions
                </h2>
                <p className="text-xs text-surface-400 dark:text-surface-500">
                  Latest ledger expenditures synced with MongoDB
                </p>
              </div>
              {expenses.length > 0 && (
                <Link
                  to="/expenses"
                  className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 inline-flex items-center gap-1 transition-colors"
                >
                  View all ({expenses.length})
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="h-14 bg-surface-100 dark:bg-surface-800/60 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : recentTransactions.length > 0 ? (
              <div className="divide-y divide-surface-100 dark:divide-surface-800">
                {recentTransactions.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => setModalState({ isOpen: true, mode: 'view', data: item })}
                    className="py-3.5 flex items-center justify-between gap-4 hover:bg-surface-50/60 dark:hover:bg-surface-800/40 rounded-xl px-2.5 transition-colors cursor-pointer"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-surface-900 dark:text-white truncate">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge category={item.category} />
                        <span className="text-xs text-surface-400 dark:text-surface-500">
                          {formatDate(item.date)}
                        </span>
                        <span className="text-xs text-surface-400 dark:text-surface-500 hidden sm:inline">
                          · {item.paymentMethod}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-surface-900 dark:text-white">
                        {formatAmount(item.amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                compact
                title="No spending data yet"
                description="Start recording your expenses to see spending trends and financial insights here."
                action={
                  <button
                    onClick={() => setModalState({ isOpen: true, mode: 'add', data: null })}
                    className="btn-primary text-xs py-2 px-4 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Record First Expense
                  </button>
                }
              />
            )}
          </div>

          {recentTransactions.length > 0 && (
            <div className="pt-3 border-t border-surface-100 dark:border-surface-800 flex justify-between items-center text-xs text-surface-400 dark:text-surface-500">
              <span>Showing {recentTransactions.length} of {expenses.length} records</span>
              <Link to="/expenses" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                Manage full ledger →
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions Panel (1 col) */}
        <div className="card flex flex-col justify-between">
          <div>
            <div className="pb-3.5 mb-4 border-b border-surface-100 dark:border-surface-800">
              <h2 className="text-base font-bold text-surface-900 dark:text-white">
                Quick Shortcuts
              </h2>
              <p className="text-xs text-surface-400 dark:text-surface-500">
                Direct actions to manage your platform
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setModalState({ isOpen: true, mode: 'add', data: null })}
                className="w-full p-3.5 rounded-xl border border-primary-200 dark:border-primary-900/60 bg-primary-50/50 dark:bg-primary-950/30 hover:bg-primary-50 dark:hover:bg-primary-950/60 transition-all flex items-start gap-3.5 text-left group"
              >
                <div className="w-9 h-9 rounded-lg bg-primary-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-surface-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    Add New Expense
                  </p>
                  <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
                    Log an expenditure with amount, category, and date.
                  </p>
                </div>
              </button>

              <button
                onClick={() => navigate('/expenses')}
                className="w-full p-3.5 rounded-xl border border-surface-200/80 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-800/30 hover:bg-surface-100/70 dark:hover:bg-surface-800 transition-all flex items-start gap-3.5 text-left group"
              >
                <div className="w-9 h-9 rounded-lg bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 flex items-center justify-center shrink-0 border border-surface-200 dark:border-surface-700">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-surface-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    Manage Expenses
                  </p>
                  <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
                    Filter, search, audit, edit, or delete transactions.
                  </p>
                </div>
              </button>

              <button
                onClick={() => navigate('/budgets')}
                className="w-full p-3.5 rounded-xl border border-surface-200/80 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-800/30 hover:bg-surface-100/70 dark:hover:bg-surface-800 transition-all flex items-start gap-3.5 text-left group"
              >
                <div className="w-9 h-9 rounded-lg bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 flex items-center justify-center shrink-0 border border-surface-200 dark:border-surface-700">
                  <PiggyBank className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-surface-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    Budget Planning
                  </p>
                  <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
                    Set limits per category and track spend progress.
                  </p>
                </div>
              </button>
            </div>
          </div>

          <div className="mt-6 p-3 rounded-xl bg-surface-50 dark:bg-surface-850 border border-surface-200/60 dark:border-surface-800 text-center">
            <p className="text-xs font-semibold text-surface-700 dark:text-surface-300">
              Personal Finance Engine
            </p>
            <p className="text-[11px] text-surface-400 dark:text-surface-500 mt-0.5">
              Real-time synchronization active
            </p>
          </div>
        </div>
      </div>

      {/* ── Add / Edit / Inspect Expense Modal ── */}
      <ExpenseModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        initialData={modalState.data}
        onClose={() => setModalState({ isOpen: false, mode: 'add', data: null })}
        onSuccess={handleModalSuccess}
      />

      {/* ── Toast Notification ── */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}

export default Dashboard;
