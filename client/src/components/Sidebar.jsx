import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  PiggyBank,
  LineChart,
  FileText,
  Settings,
  Wallet,
  X,
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
    group: 'Manage',
    items: [
      {
        id: 'nav-expenses',
        label: 'Expenses',
        to: '/expenses',
        icon: Receipt,
      },
      {
        id: 'nav-budgets',
        label: 'Budgets',
        to: '/budgets',
        icon: PiggyBank,
      },
    ],
  },
  {
    group: 'Intelligence',
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
 * Sidebar — modern, compact SaaS navigation sidebar.
 * Clean typography, Lucide icons, responsive drawer, zero student/development badges.
 */
function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* ── Mobile backdrop overlay ── */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-surface-950/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar container ── */}
      <aside
        className={[
          'fixed md:static inset-y-0 left-0 z-50',
          'w-64 bg-white dark:bg-surface-900 border-r border-surface-200/80 dark:border-surface-800 flex flex-col shrink-0',
          'transition-transform duration-200 ease-out shadow-xl md:shadow-none',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        ].join(' ')}
      >
        {/* ── Brand Header ── */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-surface-200/80 dark:border-surface-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-xs">
              <Wallet className="w-5 h-5 text-white stroke-[2.2]" />
            </div>
            <div>
              <span className="font-bold text-surface-900 dark:text-white text-base tracking-tight leading-tight block">
                ExpenseTracker
              </span>
              <span className="text-[11px] font-medium text-surface-400 dark:text-surface-500 block">
                Smart Personal Finance
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Grouped Navigation ── */}
        <div className="flex-1 px-3 py-5 space-y-6 overflow-y-auto">
          {NAV_GROUPS.map((group) => (
            <div key={group.group}>
              <p className="text-[11px] font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider px-3 mb-1.5">
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
                          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                          isActive
                            ? 'bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 font-semibold shadow-2xs'
                            : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100/70 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-white',
                        ].join(' ')
                      }
                    >
                      <Icon className="w-4 h-4 shrink-0 stroke-[2]" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* ── User Profile Footer ── */}
        <div className="p-3 border-t border-surface-200/80 dark:border-surface-800 shrink-0">
          <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800/60 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/60 text-primary-700 dark:text-primary-300 flex items-center justify-center font-bold text-xs">
              JD
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-surface-900 dark:text-white truncate">
                Personal Workspace
              </p>
              <p className="text-[11px] text-surface-400 dark:text-surface-500 truncate">
                finance@workspace.io
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
