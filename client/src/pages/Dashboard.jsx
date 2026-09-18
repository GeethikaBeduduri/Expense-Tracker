import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getExpenses } from '../services/api.js';
import PageHeader from '../components/PageHeader.jsx';
import StatCard from '../components/StatCard.jsx';
import Badge from '../components/Badge.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import QuickAction from '../components/QuickAction.jsx';
import { StatCardSkeleton } from '../components/LoadingSkeleton.jsx';

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount || 0);
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExpensesData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getExpenses();
      setExpenses(response.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpensesData();
  }, [fetchExpensesData]);

  // Compute live metrics strictly from database state (zero fake data)
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

    const monthName = now.toLocaleString('en-IN', { month: 'long', year: 'numeric' });

    return {
      totalFormatted: formatCurrency(total),
      thisMonthFormatted: formatCurrency(thisMonthTotal),
      countFormatted: count.toLocaleString('en-IN'),
      averageFormatted: formatCurrency(average),
      monthName,
      rawCount: count,
    };
  }, [expenses]);

  const recentTransactions = useMemo(() => {
    return [...expenses].slice(0, 5);
  }, [expenses]);

  return (
    <div className="space-y-6">
      {/* ── Page Header (Identical structure across pages) ── */}
      <PageHeader
        breadcrumb="Overview"
        title="Dashboard"
        subtitle="Financial overview, live ledger metrics, and transaction status."
        badge={loading ? 'Syncing...' : 'Phase 1 Active'}
        primaryAction={
          <Link to="/add-expense" className="btn-primary shadow-xs">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Expense
          </Link>
        }
      />

      {/* ── Error State (if API fails) ── */}
      {!loading && error && (
        <ErrorState
          title="Dashboard Metrics Unavailable"
          message={error}
          onRetry={fetchExpensesData}
        />
      )}

      {/* ── ROW 1: Four Primary Stat Cards ── */}
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
            id="card-total-expenses"
            label="Total Expenses"
            value={stats.totalFormatted}
            caption="Cumulative total recorded"
            indicatorText="All time"
            indicatorColor="bg-primary-50 text-primary-700 border-primary-200"
            color="bg-primary-50 text-primary-600"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />

          <StatCard
            id="card-this-month"
            label="This Month"
            value={stats.thisMonthFormatted}
            caption={`Spent in ${stats.monthName}`}
            indicatorText={stats.monthName}
            indicatorColor="bg-emerald-50 text-emerald-700 border-emerald-200"
            color="bg-emerald-50 text-emerald-600"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          />

          <StatCard
            id="card-transactions"
            label="Transactions"
            value={stats.countFormatted}
            caption="Total entries stored in database"
            indicatorText={`${stats.rawCount} records`}
            indicatorColor="bg-violet-50 text-violet-700 border-violet-200"
            color="bg-violet-50 text-violet-600"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
          />

          <StatCard
            id="card-average"
            label="Average Expense"
            value={stats.averageFormatted}
            caption="Mean value per recorded entry"
            indicatorText="Per Record"
            indicatorColor="bg-amber-50 text-amber-700 border-amber-200"
            color="bg-amber-50 text-amber-600"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
          />
        </div>
      )}

      {/* ── ROW 2: Planned Modules (Spending Overview & Category Distribution) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module 1: Spending Overview (Planned Analytics) */}
        <div className="card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-surface-100">
              <div>
                <h2 className="text-base font-bold text-surface-900">Spending Overview</h2>
                <p className="text-xs text-surface-400">Monthly velocity and trend visualization</p>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-surface-100 text-surface-600 border border-surface-200">
                Phase 3 Module
              </span>
            </div>

            <div className="py-6 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 mb-3 shadow-2xs">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-surface-900">Time-Series Analytics Engine</h3>
              <p className="text-xs text-surface-500 mt-1 max-w-sm leading-relaxed">
                The analytics engine will be available in the Analytics phase. It will compute daily spending burn rates and interactive rolling averages using MongoDB aggregation pipelines.
              </p>

              {/* Wireframe Placeholder Visual */}
              <div className="mt-5 w-full bg-surface-50 rounded-xl p-3 border border-surface-200/60 flex items-end gap-2 h-20 justify-between">
                {[35, 55, 40, 75, 50, 85, 65, 90].map((h, i) => (
                  <div key={i} className="w-full bg-surface-200/70 rounded-t-sm" style={{ height: `${h}%` }}></div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-surface-100 text-center">
            <span className="text-[11px] text-surface-400">Scheduled for Phase 3 Release</span>
          </div>
        </div>

        {/* Module 2: Category Distribution (Planned Analytics) */}
        <div className="card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-surface-100">
              <div>
                <h2 className="text-base font-bold text-surface-900">Category Distribution</h2>
                <p className="text-xs text-surface-400">Portfolio allocation & category breakdown</p>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-surface-100 text-surface-600 border border-surface-200">
                Phase 3 Module
              </span>
            </div>

            <div className="py-6 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-3 shadow-2xs">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-surface-900">Category Budgeting Model</h3>
              <p className="text-xs text-surface-500 mt-1 max-w-sm leading-relaxed">
                Visual category distribution and pie breakdown charts will be available in the Analytics phase, utilizing normalized Mongoose categories.
              </p>

              {/* Wireframe Placeholder Visual */}
              <div className="mt-5 w-full bg-surface-50 rounded-xl p-3 border border-surface-200/60 space-y-2">
                <div className="flex justify-between text-[11px] text-surface-500">
                  <span>Schema Categories Ready</span>
                  <span className="font-semibold text-surface-700">8 Validated Types</span>
                </div>
                <div className="w-full bg-surface-200 h-2 rounded-full overflow-hidden flex">
                  <div className="bg-primary-500 w-1/3"></div>
                  <div className="bg-emerald-500 w-1/4"></div>
                  <div className="bg-amber-500 w-1/5"></div>
                  <div className="bg-purple-500 w-1/5"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-surface-100 text-center">
            <span className="text-[11px] text-surface-400">Scheduled for Phase 3 Release</span>
          </div>
        </div>
      </div>

      {/* ── ROW 3: Recent Transactions & Quick Actions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Recent Transactions */}
        <div className="card lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-surface-100">
              <div>
                <h2 className="text-base font-bold text-surface-900">Recent Transactions</h2>
                <p className="text-xs text-surface-400">Latest expense entries saved to database</p>
              </div>
              {expenses.length > 0 && (
                <Link
                  to="/expenses"
                  className="text-xs font-semibold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1 transition-colors"
                >
                  View all ({expenses.length})
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-12 bg-surface-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : recentTransactions.length > 0 ? (
              <div className="divide-y divide-surface-100">
                {recentTransactions.map((item) => (
                  <div key={item._id} className="py-3 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-surface-900 truncate">{item.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge category={item.category} />
                        <span className="text-xs text-surface-400">{formatDate(item.date)}</span>
                        <span className="text-xs text-surface-400 hidden sm:inline">· {item.paymentMethod}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-surface-900">{formatCurrency(item.amount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                compact
                title="No transactions yet"
                description="Your recent expenses will stream here as soon as you record your first entry."
                action={
                  <Link to="/add-expense" className="btn-primary text-xs py-2 px-4 shadow-xs">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Expense
                  </Link>
                }
              />
            )}
          </div>

          {recentTransactions.length > 0 && (
            <div className="pt-3 border-t border-surface-100 flex justify-between items-center text-xs text-surface-400">
              <span>Showing {recentTransactions.length} of {expenses.length} records</span>
              <Link to="/expenses" className="text-primary-600 font-semibold hover:underline">
                Manage full ledger →
              </Link>
            </div>
          )}
        </div>

        {/* Right (1 col): Quick Actions */}
        <div className="card flex flex-col justify-between">
          <div>
            <div className="pb-3.5 mb-4 border-b border-surface-100">
              <h2 className="text-base font-bold text-surface-900">Quick Actions</h2>
              <p className="text-xs text-surface-400">Direct shortcuts to Phase 1 workflows</p>
            </div>

            <div className="space-y-3">
              <QuickAction
                primary
                to="/add-expense"
                title="Record New Expense"
                description="Log a new transaction with title, amount, category, and date."
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                }
              />

              <QuickAction
                to="/expenses"
                title="View All Expenses"
                description="Browse, audit, and manage full transaction records in the ledger."
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                }
              />
            </div>
          </div>

          <div className="mt-6 p-3 rounded-xl bg-surface-50 border border-surface-200/70 text-center">
            <p className="text-[11px] text-surface-500">
              Phase 1 Core CRUD · Live API on port 5000
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
