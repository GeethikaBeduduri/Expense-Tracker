import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Award,
  BarChart3,
  PieChart as PieIcon,
  Layers,
} from 'lucide-react';
import { getExpenses } from '../services/api.js';
import { usePreferences } from '../context/PreferencesContext.jsx';
import PageHeader from '../components/PageHeader.jsx';
import StatCard from '../components/StatCard.jsx';
import ChartCard from '../components/ChartCard.jsx';
import Badge from '../components/Badge.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorState from '../components/ErrorState.jsx';

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

export default function Analytics() {
  const { formatAmount, currencySymbol } = usePreferences();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalyticsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getExpenses();
      setExpenses(response.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to retrieve analytics.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  // Analytics calculations strictly from database records
  const metrics = useMemo(() => {
    if (expenses.length === 0) {
      return {
        highest: null,
        lowest: null,
        topCategory: 'None',
        topCategoryAmount: 0,
        average: 0,
        total: 0,
      };
    }

    const total = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    const average = total / expenses.length;

    // Highest and lowest expenses
    const sorted = [...expenses].sort((a, b) => b.amount - a.amount);
    const highest = sorted[0];
    const lowest = sorted[sorted.length - 1];

    // Category aggregation
    const catMap = {};
    expenses.forEach((e) => {
      catMap[e.category] = (catMap[e.category] || 0) + Number(e.amount);
    });

    let topCat = 'Other';
    let topCatMax = 0;
    Object.entries(catMap).forEach(([cat, amt]) => {
      if (amt > topCatMax) {
        topCatMax = amt;
        topCat = cat;
      }
    });

    return {
      highest,
      lowest,
      topCategory: topCat,
      topCategoryAmount: topCatMax,
      average,
      total,
    };
  }, [expenses]);

  // Category breakdown data
  const categoryChartData = useMemo(() => {
    if (expenses.length === 0) return [];
    const catMap = {};
    expenses.forEach((e) => {
      catMap[e.category] = (catMap[e.category] || 0) + Number(e.amount);
    });

    return Object.entries(catMap)
      .map(([name, value]) => ({
        name,
        value: Math.round(value),
        color: CATEGORY_COLORS[name] || CATEGORY_COLORS.Other,
      }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  // Day of week distribution
  const dayOfWeekData = useMemo(() => {
    if (expenses.length === 0) return [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const counts = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };

    expenses.forEach((e) => {
      const dayName = days[new Date(e.date).getDay()];
      counts[dayName] = (counts[dayName] || 0) + Number(e.amount);
    });

    return days.map((day) => ({
      day,
      amount: Math.round(counts[day]),
    }));
  }, [expenses]);

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <PageHeader
        breadcrumb="Insights"
        title="Analytics"
        subtitle="Deep dive into your financial habits, category breakdown, and transaction patterns."
        badge={!loading && !error ? `${expenses.length} Records Analyzed` : undefined}
      />

      {/* ── Error State ── */}
      {!loading && error && (
        <ErrorState message={error} onRetry={fetchAnalyticsData} />
      )}

      {/* ── Empty State ── */}
      {!loading && !error && expenses.length === 0 && (
        <EmptyState
          icon={<BarChart3 className="w-7 h-7" />}
          title="No analytics available"
          description="Record a few transactions to unlock visual trends, category distribution, and burn insights."
        />
      )}

      {/* ── Summary Cards ── */}
      {!loading && !error && expenses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            label="Top Category"
            value={metrics.topCategory}
            caption={`${formatAmount(metrics.topCategoryAmount)} total`}
            color="bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400"
            icon={<Award className="w-5 h-5 stroke-[2]" />}
          />
          <StatCard
            label="Peak Expense"
            value={formatAmount(metrics.highest?.amount || 0)}
            caption={metrics.highest?.title || 'None'}
            color="bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400"
            icon={<ArrowUpRight className="w-5 h-5 stroke-[2]" />}
          />
          <StatCard
            label="Lowest Expense"
            value={formatAmount(metrics.lowest?.amount || 0)}
            caption={metrics.lowest?.title || 'None'}
            color="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400"
            icon={<ArrowDownRight className="w-5 h-5 stroke-[2]" />}
          />
          <StatCard
            label="Mean Transaction"
            value={formatAmount(metrics.average)}
            caption="Average per transaction"
            color="bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400"
            icon={<TrendingUp className="w-5 h-5 stroke-[2]" />}
          />
        </div>
      )}

      {/* ── Visual Charts ── */}
      {!loading && !error && expenses.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Day of Week Burn (BarChart) */}
          <ChartCard
            title="Day of Week Spending"
            subtitle="Aggregated transaction volume by day"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dayOfWeekData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${currencySymbol}${v}`} />
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
                <Bar dataKey="amount" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Category Distribution (Donut) */}
          <ChartCard
            title="Portfolio Category Share"
            subtitle="Total value share per expense category"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryChartData.map((entry, index) => (
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
      )}

      {/* ── Category Breakdown Detail Table ── */}
      {!loading && !error && categoryChartData.length > 0 && (
        <div className="card p-0 overflow-hidden shadow-xs border border-surface-200/80 dark:border-surface-800">
          <div className="p-4 border-b border-surface-200/80 dark:border-surface-800">
            <h3 className="text-base font-bold text-surface-900 dark:text-white">
              Category Allocation Table
            </h3>
            <p className="text-xs text-surface-400 dark:text-surface-500">
              Detailed ranking and percentage of total expenditure
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-surface-50 dark:bg-surface-850 text-surface-500 dark:text-surface-400 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Total Spent</th>
                  <th className="px-5 py-3">Percentage of Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-surface-800 bg-white dark:bg-surface-900">
                {categoryChartData.map((cat) => {
                  const pct = metrics.total > 0 ? Math.round((cat.value / metrics.total) * 100) : 0;
                  return (
                    <tr key={cat.name} className="hover:bg-surface-50/70 dark:hover:bg-surface-800/50">
                      <td className="px-5 py-3.5">
                        <Badge category={cat.name} />
                      </td>
                      <td className="px-5 py-3.5 font-bold text-surface-900 dark:text-white">
                        {formatAmount(cat.value)}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-28 bg-surface-100 dark:bg-surface-800 h-2 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${pct}%`, backgroundColor: cat.color }}
                            ></div>
                          </div>
                          <span className="text-xs font-semibold text-surface-700 dark:text-surface-300">
                            {pct}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
