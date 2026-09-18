import { useLocation } from 'react-router-dom';

const ROUTE_TITLES = {
  '/': { title: 'Dashboard', section: 'Overview' },
  '/expenses': { title: 'Expenses', section: 'Records' },
  '/add-expense': { title: 'Add Expense', section: 'Transactions' },
};

/**
 * Navbar — sticky header showing breadcrumbs, phase badge, and avatar context.
 */
function Navbar({ onMenuClick }) {
  const location = useLocation();
  const currentRoute = ROUTE_TITLES[location.pathname] || { title: 'ExpenseTracker', section: 'App' };

  return (
    <header className="h-16 bg-white border-b border-surface-200 flex items-center justify-between px-4 sm:px-6 shrink-0 z-20">
      {/* Left: Mobile hamburger & breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          id="sidebar-toggle-btn"
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-xl text-surface-600 hover:bg-surface-100 hover:text-surface-900 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label="Open sidebar menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-surface-400 hidden sm:inline">{currentRoute.section}</span>
          <span className="text-surface-300 hidden sm:inline">/</span>
          <span className="font-semibold text-surface-900">{currentRoute.title}</span>
        </div>
      </div>

      {/* Right: Phase Status & User Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Environment / Phase Badge */}
        <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Phase 1: Core CRUD Active</span>
        </div>

        {/* User avatar indicator */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-surface-200">
          <div
            className="w-8 h-8 rounded-xl bg-primary-100 border border-primary-200 flex items-center justify-center text-primary-700 text-xs font-bold shadow-2xs"
            title="User Profile (Authentication in Phase 2)"
          >
            ET
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-surface-800 leading-tight">Student Workspace</p>
            <p className="text-[11px] text-surface-400 leading-tight">FSD College Project</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
