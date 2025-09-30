import jwt from 'jsonwebtoken';
import config from '../config.js';
import { AuthenticationError } from '../utils/errors.js';

export function generateToken(payload) {
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, config.JWT_SECRET);
  } catch (error) {
    throw new AuthenticationError('Invalid or expired token');
  }
}