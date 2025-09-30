import { AppError } from './errors.js';

/**
 * Middleware to validate request body using Zod schema
 */
export const validateBody = (schema) => (req, res, next) => {
  try {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      const error = new AppError('Validation failed', 400, 'VALIDATION_ERROR');
      error.details = errors;
      return next(error);
    }
    req.body = result.data;
    req.validatedBody = result.data;
    next();
  } catch (error) {
    next(new AppError('Validation error', 400, 'VALIDATION_ERROR'));
  }
};