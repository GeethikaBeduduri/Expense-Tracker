/**
 * Loading — full-width centered spinner.
 * Used while async data is being fetched from the API.
 */
function Loading({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      {/* Animated spinner ring */}
      <div className="w-10 h-10 border-4 border-surface-200 border-t-primary-600 rounded-full animate-spin" />
      <p className="text-sm text-surface-500">{message}</p>
    </div>
  );
}

export default Loading;
