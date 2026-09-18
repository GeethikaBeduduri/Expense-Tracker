/**
 * FilterBar — scaffolded search and category filter controls.
 * Explicitly marked as a Phase 2 architectural roadmap feature so search/filter is neither faked nor confusing.
 */
export default function FilterBar() {
  return (
    <div className="card p-3.5 bg-surface-50/70 border border-surface-200">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Scaffolded Search Input */}
        <div className="relative flex-1 opacity-70 cursor-not-allowed">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-surface-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            disabled
            placeholder="Search by title or description (Scheduled for Phase 2)..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-surface-200 bg-white text-surface-400 text-sm cursor-not-allowed select-none"
          />
        </div>

        {/* Scaffolded Category Select & Phase Tag */}
        <div className="flex items-center gap-2.5">
          <select
            disabled
            className="px-3.5 py-2 rounded-xl border border-surface-200 bg-white text-surface-400 text-sm cursor-not-allowed select-none"
          >
            <option>All Categories (Phase 2)</option>
          </select>

          <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-surface-200/80 text-surface-600 border border-surface-300/60">
            Phase 2 Scaffolding
          </span>
        </div>
      </div>
    </div>
  );
}
