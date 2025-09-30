/**
 * Async handler wrapper for Express routes
 * Automatically catches async errors and passes them to Express error handler
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;