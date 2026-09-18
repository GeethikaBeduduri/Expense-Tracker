/**
 * Consistent JSON error envelope used by all error responses.
 * { success: false, message: "...", stack: "..." (dev only) }
 */

// ── 404 — Route not found ──────────────────────────────────────────────────
export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

// ── Central error handler ──────────────────────────────────────────────────
// Must have four parameters so Express recognises it as an error handler.
export const errorHandler = (err, req, res, next) => {
  // Some errors arrive without a status code; default to 500.
  const statusCode = err.statusCode || res.statusCode === 200 ? err.statusCode || 500 : res.statusCode;

  // Mongoose CastError (invalid ObjectId) → treat as 404
  if (err.name === 'CastError') {
    err.message = 'Resource not found — invalid ID format';
    err.statusCode = 404;
  }

  // Mongoose validation error → 400
  if (err.name === 'ValidationError') {
    err.message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
    err.statusCode = 400;
  }

  res.status(err.statusCode || statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};
