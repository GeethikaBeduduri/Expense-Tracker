import { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

/**
 * Toast — lightweight, accessible notification for success and alert messages.
 */
export default function Toast({
  message,
  type = 'success',
  onClose,
  duration = 4000,
}) {
  useEffect(() => {
    if (!message || !onClose) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, onClose, duration]);

  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div
      role="alert"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-sm font-medium transition-all transform duration-200 animate-in fade-in slide-in-from-bottom-3 ${
        isSuccess
          ? 'bg-white dark:bg-surface-900 border-emerald-200 dark:border-emerald-800 text-surface-900 dark:text-white'
          : 'bg-white dark:bg-surface-900 border-rose-200 dark:border-rose-800 text-surface-900 dark:text-white'
      }`}
    >
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
          isSuccess
            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
            : 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
        }`}
      >
        {isSuccess ? (
          <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
        ) : (
          <AlertCircle className="w-4 h-4 stroke-[2.5]" />
        )}
      </div>

      <p className="pr-2">{message}</p>

      {onClose && (
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
