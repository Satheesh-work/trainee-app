// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Set default status code and message
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Send error response
  res.status(statusCode).json({
    success: false,
    message: message,
    // Only show error stack in development mode
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;