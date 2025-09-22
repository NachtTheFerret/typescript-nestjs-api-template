/**
 * Application-wide constants
 */

// Load environment variables from .env file
import * as dotenv from 'dotenv';
dotenv.config();

// Application metadata
export const APP_NAME = 'NestJS API Template';
export const APP_VERSION = '1.0.0';

// Server configuration
export const DEFAULT_PORT = process.env.PORT || 3000;

// JWT configuration
export const JWT_ACCESS_EXPIRATION = process.env.JWT_ACCESS_EXPIRATION || '15m';
export const JWT_REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION || '7d';
export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
if (!JWT_ACCESS_SECRET) throw new Error('JWT_ACCESS_SECRET is not defined');
if (!JWT_REFRESH_SECRET) throw new Error('JWT_REFRESH_SECRET is not defined');

// Bcrypt configuration
export const BCRYPT_SALT_ROUNDS = 10;

// Pagination configuration
export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};
