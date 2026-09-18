import { NavLink } from 'react-router-dom';

const MAIN_NAV = [
  {
    id: 'nav-dashboard',
    label: 'Dashboard',
    to: '/',
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: 'nav-expenses',
    label: 'Expenses',
    to: '/expenses',
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    id: 'nav-add-expense',
    label: 'Add Expense',
    to: '/add-expense',
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
];

const FUTURE_NAV = [
  {
    id: 'nav-budgets',
    label: 'Budgets',
    phase: 'Phase 2',
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
      </svg>
    ),
  },
  {
    id: 'nav-analytics',
    label: 'Analytics',
    phase: 'Phase 3',
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
    ),
  },
  {
    id: 'nav-reports',
    label: 'Reports',
    phase: 'Phase 4',
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: 'nav-ai-insights',
    label: 'AI Insights',
    phase: 'Phase 5',
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
];

/**
 * Sidebar — grouped persistent navigation with Phase 1 CRUD & future roadmap previews.
 */
function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* ── Mobile backdrop overlay ── */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-surface-900/40 backdrop-blur-xs z-30 md:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar panel ── */}
      <aside
        className={[
          'fixed md:static inset-y-0 left-0 z-40',
          'w-64 bg-white border-r border-surface-200 flex flex-col shrink-0',
          'transition-transform duration-200 ease-out shadow-lg md:shadow-none',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        ].join(' ')}
      >
        {/* ── Logo & App Branding ── */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-surface-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-xs">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-surface-900 text-base leading-tight block">ExpenseTracker</span>
              <span className="text-[11px] font-medium text-surface-400 block">Personal Finance Ledger</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-surface-400 hover:text-surface-700 hover:bg-surface-100"
            aria-label="Close sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Navigation Links ── */}
        <div className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
          {/* Main Navigation */}
          <div>
            <p className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider px-3 mb-2">
              Main Menu
            </p>
            <nav className="space-y-1">
              {MAIN_NAV.map((item) => (
                <NavLink
                  key={item.id}
                  id={item.id}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    [
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                      isActive
                        ? 'bg-primary-50 text-primary-700 font-semibold shadow-2xs'
                        : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900',
                    ].join(' ')
                  }
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Upcoming Modules (Roadmap Only — Never Fake Functional) */}
          <div>
            <div className="flex items-center justify-between px-3 mb-2">
              <p className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider">
                Upcoming Modules
              </p>
            </div>
            <div className="space-y-1">
              {FUTURE_NAV.map((item) => (
                <div
                  key={item.id}
                  id={item.id}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-surface-400 cursor-not-allowed select-none hover:bg-surface-50/50 transition-colors"
                  title={`${item.label} — Planned for ${item.phase}`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-surface-100 text-surface-500 border border-surface-200">
                    {item.phase}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Architecture Card ── */}
        <div className="p-3 border-t border-surface-200 shrink-0">
          <div className="p-3 bg-surface-50 rounded-xl border border-surface-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-surface-900">Phase 1 · MERN</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Active
              </span>
            </div>
            <div className="space-y-1 text-[11px] text-surface-500 border-t border-surface-200/60 pt-1.5">
              <div className="flex justify-between">
                <span className="text-surface-400">Frontend:</span>
                <span className="font-medium text-surface-700">React 18 + Vite</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-400">Backend:</span>
                <span className="font-medium text-surface-700">Express 4 REST</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-400">Database:</span>
                <span className="font-medium text-surface-700">MongoDB + Mongoose</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
