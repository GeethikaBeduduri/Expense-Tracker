import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  PlusCircle,
  PiggyBank,
  LineChart,
  FileText,
  Settings,
  X,
  Database,
} from 'lucide-react';

const NAV_GROUPS = [
  {
    group: 'Overview',
    items: [
      {
        id: 'nav-dashboard',
        label: 'Dashboard',
        to: '/',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    group: 'Transactions',
    items: [
      {
        id: 'nav-expenses',
        label: 'Expenses',
        to: '/expenses',
        icon: Receipt,
      },
      {
        id: 'nav-add-expense',
        label: 'Add Expense',
        to: '/add-expense',
        icon: PlusCircle,
      },
    ],
  },
  {
    group: 'Planning',
    items: [
      {
        id: 'nav-budgets',
        label: 'Budgets',
        to: '/budgets',
        icon: PiggyBank,
      },
    ],
  },
  {
    group: 'Insights',
    items: [
      {
        id: 'nav-analytics',
        label: 'Analytics',
        to: '/analytics',
        icon: LineChart,
      },
      {
        id: 'nav-reports',
        label: 'Reports',
        to: '/reports',
        icon: FileText,
      },
    ],
  },
  {
    group: 'Preferences',
    items: [
      {
        id: 'nav-settings',
        label: 'Settings',
        to: '/settings',
        icon: Settings,
      },
    ],
  },
];

/**
 * Modern, cinematic dark fintech sidebar navigation.
 */
function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* ── Mobile backdrop overlay ── */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar container ── */}
      <aside
        className={[
          'fixed md:static inset-y-0 left-0 z-50',
          'w-64 bg-[#090b11] border-r border-white/[0.08] flex flex-col shrink-0',
          'transition-transform duration-200 ease-out shadow-2xl md:shadow-none select-none',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        ].join(' ')}
      >
        {/* ── Brand Header ── */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/[0.08] shrink-0">
          <div className="flex items-center gap-3">
            {/* Distinctive Finance Geometric Logo Mark */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-primary-600 to-cyan-500 p-[1px] shadow-lg shadow-indigo-500/25 flex items-center justify-center">
              <div className="w-full h-full bg-[#0d0f18] rounded-[11px] flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-indigo-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  <circle cx="12" cy="12" r="9" className="stroke-white/20" />
                </svg>
              </div>
            </div>
            <div>
              <span className="font-extrabold text-white text-base tracking-tight leading-tight block">
                ExpenseTracker
              </span>
              <span className="text-[10px] font-semibold text-surface-400 tracking-wider uppercase block">
                Smart Personal Finance
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-surface-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Grouped Navigation ── */}
        <div className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
          {NAV_GROUPS.map((group) => (
            <div key={group.group}>
              <p className="text-[10px] font-bold text-surface-500 uppercase tracking-widest px-3 mb-1.5">
                {group.group}
              </p>
              <nav className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.id}
                      id={item.id}
                      to={item.to}
                      end={item.to === '/'}
                      onClick={onClose}
                      className={({ isActive }) =>
                        [
                          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-150',
                          isActive
                            ? 'bg-gradient-to-r from-primary-600/20 to-primary-600/5 text-white border-l-2 border-primary-500 shadow-sm shadow-primary-500/10'
                            : 'text-surface-400 hover:bg-white/[0.04] hover:text-white',
                        ].join(' ')
                      }
                    >
                      <Icon className="w-4 h-4 shrink-0 stroke-[2.2]" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* ── User & Database Status Footer ── */}
        <div className="p-3 border-t border-white/[0.08] shrink-0 space-y-2">
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between text-[11px]">
            <span className="text-surface-400 flex items-center gap-1.5 font-medium">
              <Database className="w-3.5 h-3.5 text-indigo-400" />
              MongoDB Atlas
            </span>
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Sync
            </span>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-xl text-xs">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white text-[11px]">
              ET
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-white truncate text-[11px]">
                Personal Workspace
              </p>
              <p className="text-[10px] text-surface-400 truncate">
                Active Ledger
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
