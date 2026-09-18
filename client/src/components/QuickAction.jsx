import { Link } from 'react-router-dom';

/**
 * QuickAction — single action tile for quick navigation to working Phase 1 routes.
 */
export default function QuickAction({
  title,
  description,
  to,
  icon,
  primary = false,
}) {
  return (
    <Link
      to={to}
      className={`group p-4 rounded-xl border transition-all duration-150 flex items-start gap-3.5 ${
        primary
          ? 'bg-primary-50/50 border-primary-200 hover:bg-primary-50 hover:border-primary-300'
          : 'bg-surface-50/50 border-surface-200 hover:bg-surface-50 hover:border-surface-300'
      }`}
    >
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
          primary
            ? 'bg-primary-600 text-white'
            : 'bg-white text-surface-600 border border-surface-200 group-hover:text-primary-600'
        }`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-surface-900 group-hover:text-primary-700 transition-colors">
            {title}
          </p>
          <svg
            className="w-4 h-4 text-surface-400 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
        <p className="text-xs text-surface-500 mt-0.5 leading-relaxed">{description}</p>
      </div>
    </Link>
  );
}
