/**
 * Badge — vibrant, high-contrast dark category pill with low-opacity glow borders.
 */
const CATEGORY_STYLES = {
  Food: 'bg-amber-500/10 text-amber-300 border-amber-500/25',
  Transport: 'bg-sky-500/10 text-sky-300 border-sky-500/25',
  Shopping: 'bg-purple-500/10 text-purple-300 border-purple-500/25',
  Bills: 'bg-rose-500/10 text-rose-300 border-rose-500/25',
  Entertainment: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/25',
  Health: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25',
  Education: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/25',
  Other: 'bg-surface-400/10 text-surface-300 border-surface-400/25',
};

export default function Badge({ category, children, className = '' }) {
  const label = category || children || 'Other';
  const style = CATEGORY_STYLES[label] || CATEGORY_STYLES.Other;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-wide border ${style} ${className}`}
    >
      {label}
    </span>
  );
}
