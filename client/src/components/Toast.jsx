import { useEffect } from 'react';

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
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all transform duration-200 animate-in fade-in slide-in-from-bottom-3 ${
        isSuccess
          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
          : 'bg-red-50 border-red-200 text-red-900'
      }`}
    >
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
          isSuccess ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
        }`}
      >
        {isSuccess ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </div>

      <p className="pr-2">{message}</p>

      {onClose && (
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-black/5 text-surface-500 hover:text-surface-700 transition-colors"
          aria-label="Close notification"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
