/**
 * ==============================================================================
 * SOL ECOSYSTEM - Global Error Handler Middleware
 * File: backend/middleware/errorHandler.js
 * ==============================================================================
 */

const errorHandler = (err, req, res, next) => {
  console.error(`💥 [Unhandled Error] ${req.method} ${req.url}:`, err);

  // PostgreSQL Specific Error Handling
  if (err.code === '23505') {
    // Unique violation
    return res.status(409).json({
      success: false,
      error: 'Conflict',
      message: 'A record with this identifier already exists.',
      detail: err.detail
    });
  }

  if (err.code === '23503') {
    // Foreign key violation
    return res.status(400).json({
      success: false,
      error: 'Foreign Key Violation',
      message: 'Referenced foreign key entity does not exist.',
      detail: err.detail
    });
  }

  if (err.code === '22P02') {
    // Invalid text representation (e.g. invalid UUID format)
    return res.status(400).json({
      success: false,
      error: 'Invalid Format',
      message: 'Supplied UUID or numeric parameter format is invalid.'
    });
  }

  // Standard Fallback
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    error: err.name || 'InternalServerError',
    message: err.message || 'An unexpected error occurred on the server.',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
  });
};

module.exports = errorHandler;
