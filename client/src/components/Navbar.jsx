import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Plus, Coins, ShieldCheck } from 'lucide-react';
import { usePreferences } from '../context/PreferencesContext.jsx';

const ROUTE_INFO = {
  '/': { title: 'Dashboard', section: 'Overview' },
  '/expenses': { title: 'Expenses', section: 'Transactions' },
  '/add-expense': { title: 'Add Expense', section: 'Transactions' },
  '/budgets': { title: 'Budgets', section: 'Planning' },
  '/analytics': { title: 'Analytics', section: 'Insights' },
  '/reports': { title: 'Reports', section: 'Insights' },
  '/settings': { title: 'Settings', section: 'Preferences' },
};

/**
 * Topbar — dark, sleek glassmorphic SaaS top navigation.
 */
function Navbar({ onMenuClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { currency, currencySymbol } = usePreferences();

  const currentRoute = ROUTE_INFO[location.pathname] || {
    title: 'ExpenseTracker',
    section: 'Finance',
  };

  return (
    <header className="h-16 bg-[#090b11]/90 backdrop-blur-xl border-b border-white/[0.08] flex items-center justify-between px-4 sm:px-6 shrink-0 z-30 transition-colors">
      {/* Left: Mobile menu toggle + breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          id="sidebar-toggle-btn"
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-xl text-surface-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs">
          <span className="text-surface-400 uppercase tracking-wider font-bold hidden sm:inline text-[11px]">
            {currentRoute.section}
          </span>
          <span className="text-white/20 hidden sm:inline">/</span>
          <span className="font-bold text-white tracking-tight text-sm">
            {currentRoute.title}
          </span>
        </nav>
      </div>

      {/* Right: Quick actions, currency indicator, user workspace */}
      <div className="flex items-center gap-3">
        {/* Quick Add Button */}
        {location.pathname !== '/add-expense' && (
          <button
            onClick={() => navigate('/add-expense')}
            className="btn-primary text-xs py-2 px-3 sm:px-4 shadow-lg shadow-indigo-600/20 font-semibold"
            title="Record a new transaction"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">New Expense</span>
          </button>
        )}

        {/* Currency Indicator Pill */}
        <button
          onClick={() => navigate('/settings')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-bold text-surface-300 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.15] transition-all cursor-pointer"
          title="Currency preference"
        >
          <span className="text-indigo-400 font-extrabold">{currencySymbol}</span>
          <span>{currency}</span>
        </button>

        {/* Workspace Avatar */}
        <div
          onClick={() => navigate('/settings')}
          className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 text-xs font-black cursor-pointer hover:border-indigo-400 transition-colors"
          title="Personal Workspace Settings"
        >
          PW
        </div>
      </div>
    </header>
  );
}

export default Navbar;
