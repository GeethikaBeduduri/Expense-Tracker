import { Link } from 'react-router-dom';

/**
 * NotFound — displayed for any route that doesn't match the defined paths.
 */
function NotFound() {
  return (
    <div className="min-h-screen bg-surface-100 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Large 404 */}
        <p className="text-8xl font-black text-primary-200 select-none">404</p>

        <h1 className="text-2xl font-bold text-surface-900 mt-4">Page not found</h1>
        <p className="text-surface-500 text-sm mt-2">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="mt-8">
          <Link id="back-home-btn" to="/" className="btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
