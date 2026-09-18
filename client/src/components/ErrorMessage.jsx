/**
 * ErrorMessage — displays an API or runtime error with a retry option.
 * Accepts a message string and an optional onRetry callback.
 */
function ErrorMessage({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-4">
      {/* Error icon */}
      <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
        <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <div>
        <p className="text-surface-800 font-medium">Failed to load data</p>
        <p className="text-sm text-surface-500 mt-1 max-w-sm">{message}</p>
      </div>

      {onRetry && (
        <button id="error-retry-btn" onClick={onRetry} className="btn-secondary">
          Try again
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
