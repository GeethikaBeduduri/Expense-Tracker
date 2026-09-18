import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Plus, Sun, Moon, Sparkles } from 'lucide-react';
import { usePreferences } from '../context/PreferencesContext.jsx';

const ROUTE_INFO = {
  '/': { title: 'Dashboard', section: 'Overview' },
  '/expenses': { title: 'Expenses', section: 'Transactions' },
  '/add-expense': { title: 'Add Expense', section: 'Transactions' },
  '/budgets': { title: 'Budgets', section: 'Planning' },
  '/analytics': { title: 'Analytics', section: 'Insights' },
  '/reports': { title: 'Reports', section: 'Data' },
  '/settings': { title: 'Settings', section: 'Preferences' },
};

/**
 * Navbar — modern, responsive SaaS top navigation bar.
 * Breadcrumb context, theme toggle, currency indicator, and global new transaction action.
 */
function Navbar({ onMenuClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme, currency, currencySymbol } = usePreferences();

  const currentRoute = ROUTE_INFO[location.pathname] || {
    title: 'ExpenseTracker',
    section: 'App',
  };

  return (
    <header className="h-16 bg-white dark:bg-surface-900 border-b border-surface-200/80 dark:border-surface-800 flex items-center justify-between px-4 sm:px-6 shrink-0 z-30 transition-colors duration-200">
      {/* Left: Mobile hamburger & breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          id="sidebar-toggle-btn"
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-xl text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
          <span className="text-surface-400 dark:text-surface-500 hidden sm:inline font-normal">
            {currentRoute.section}
          </span>
          <span className="text-surface-300 dark:text-surface-600 hidden sm:inline">/</span>
          <span className="font-semibold text-surface-900 dark:text-white">
            {currentRoute.title}
          </span>
        </nav>
      </div>

      {/* Right: Quick actions, currency indicator, theme switcher, avatar */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Quick Add Button (hidden on /add-expense) */}
        {location.pathname !== '/add-expense' && (
          <button
            onClick={() => navigate('/add-expense')}
            className="btn-primary text-xs py-2 px-3 sm:px-3.5 shadow-2xs font-semibold"
            title="Quick record new expense"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">New Expense</span>
          </button>
        )}

        {/* Currency Indicator Pill */}
        <div
          onClick={() => navigate('/settings')}
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-xs font-semibold text-surface-700 dark:text-surface-300 hover:bg-surface-200/60 transition-colors cursor-pointer"
          title="Currency setting (click to change)"
        >
          <span className="text-primary-600 dark:text-primary-400 font-bold">{currencySymbol}</span>
          <span>{currency}</span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 stroke-[2.2]" />
          ) : (
            <Moon className="w-4 h-4 text-surface-600 stroke-[2.2]" />
          )}
        </button>

        {/* User Workspace Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-surface-200 dark:border-surface-800">
          <div
            className="w-8 h-8 rounded-xl bg-primary-100 dark:bg-primary-900/60 border border-primary-200 dark:border-primary-800 flex items-center justify-center text-primary-700 dark:text-primary-300 text-xs font-bold"
            title="Personal Workspace Account"
          >
            ET
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
