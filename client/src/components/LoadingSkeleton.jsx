/**
 * LoadingSkeleton — Pulse loading placeholders for tables and stat cards.
 */

export function StatCardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="flex items-start justify-between">
        <div className="w-11 h-11 rounded-xl bg-surface-200"></div>
        <div className="w-16 h-5 rounded-full bg-surface-200"></div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="w-20 h-3.5 rounded bg-surface-200"></div>
        <div className="w-32 h-7 rounded bg-surface-200"></div>
        <div className="w-24 h-3 rounded bg-surface-200"></div>
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 6 }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-surface-200 rounded w-full max-w-[120px]"></div>
        </td>
      ))}
    </tr>
  );
}
