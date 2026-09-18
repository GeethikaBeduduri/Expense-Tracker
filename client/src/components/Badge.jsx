/**
 * Badge — consistent category and status pill indicators.
 */
const CATEGORY_STYLES = {
  Food: 'bg-amber-50 text-amber-700 border-amber-200',
  Transport: 'bg-blue-50 text-blue-700 border-blue-200',
  Shopping: 'bg-purple-50 text-purple-700 border-purple-200',
  Bills: 'bg-rose-50 text-rose-700 border-rose-200',
  Entertainment: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Health: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Education: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  Other: 'bg-slate-100 text-slate-700 border-slate-200',
};

export default function Badge({ category, children, variant = 'category', className = '' }) {
  const label = category || children;
  const style = CATEGORY_STYLES[label] || CATEGORY_STYLES.Other;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style} ${className}`}
    >
      {label}
    </span>
  );
}
