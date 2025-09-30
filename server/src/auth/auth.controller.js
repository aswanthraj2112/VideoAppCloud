import { AppError, AuthenticationError } from '../utils/errors.js';

// Placeholder auth controller functions for minimal implementation
export async function register(req, res) {
  throw new AppError('User registration not implemented in minimal version', 501, 'NOT_IMPLEMENTED');
}

export async function login(req, res) {
  throw new AppError('User login not implemented in minimal version', 501, 'NOT_IMPLEMENTED');
}

export async function confirmSignUp(req, res) {
  throw new AppError('User confirmation not implemented in minimal version', 501, 'NOT_IMPLEMENTED');
}

export async function resendConfirmationCode(req, res) {
  throw new AppError('Confirmation code resend not implemented in minimal version', 501, 'NOT_IMPLEMENTED');
}

export async function me(req, res) {
  throw new AppError('User profile not implemented in minimal version', 501, 'NOT_IMPLEMENTED');
}