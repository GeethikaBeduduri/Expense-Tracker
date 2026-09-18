/**
 * ErrorState — user-friendly error card with clear title, friendly message, and retry button.
 * Filters out raw technical Axios strings in favor of understandable user guidance.
 */
export default function ErrorState({
  title = 'Unable to Load Data',
  message,
  onRetry,
}) {
  // Format or sanitize technical error messages into clear, friendly guidance
  let userFriendlyMessage = message;
  if (!userFriendlyMessage) {
    userFriendlyMessage = 'A network or server error occurred while retrieving your records. Please ensure your backend is active and retry.';
  } else if (
    userFriendlyMessage.includes('Network Error') ||
    userFriendlyMessage.includes('ECONNREFUSED')
  ) {
    userFriendlyMessage = 'Could not establish a connection to the backend server (http://localhost:5000). Please ensure the API is running.';
  }

  return (
    <div className="card border-red-200 bg-red-50/40 p-8 flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-2xl bg-red-100 border border-red-200 flex items-center justify-center text-red-600 mb-3 shadow-xs">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <h3 className="text-base font-semibold text-surface-900">{title}</h3>
      <p className="text-sm text-surface-600 max-w-md mt-1 leading-relaxed">
        {userFriendlyMessage}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 btn-secondary border-surface-300 text-surface-800 hover:bg-white shadow-xs"
        >
          <svg className="w-4 h-4 text-surface-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Try Again
        </button>
      )}
    </div>
  );
}
