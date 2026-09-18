import { AlertTriangle, X } from 'lucide-react';

/**
 * ConfirmDialog — SaaS-grade confirmation modal.
 * Replaces window.confirm with an accessible, styled modal dialog.
 */
export default function ConfirmDialog({
  isOpen,
  title = 'Delete Item',
  message = 'Are you sure you want to delete this record? This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="card w-full max-w-md p-6 bg-white dark:bg-surface-900 shadow-2xl border border-surface-200 dark:border-surface-800 animate-in zoom-in-95 duration-150">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-surface-900 dark:text-white">
                {title}
              </h3>
              <button
                onClick={onCancel}
                disabled={loading}
                className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 p-1 rounded-lg transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-2 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-surface-100 dark:border-surface-800">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="btn-secondary text-xs py-2 px-3.5"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="btn-danger text-xs py-2 px-4 shadow-xs"
          >
            {loading ? (
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 border-2 border-rose-600 dark:border-rose-400 border-t-transparent rounded-full animate-spin"></span>
                Processing...
              </span>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
