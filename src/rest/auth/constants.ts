/**
 * Authentication module constants
 * Includes JWT and Bcrypt configuration settings.
 * Loads values from environment variables with defaults where applicable.
 */

// # JWT configuration
/**
 * JWT token expiration time.
 * Defaults to '1m' (1 minute) if not set in environment variables.
 * Format examples: '60s', '10m', '24h', '7d'
 */
export const JWT_ACCESS_EXPIRATION = process.env.JWT_EXPIRATION || '1m';

/**
 * JWT refresh token expiration time.
 * Defaults to '7d' (7 days) if not set in environment variables.
 * Format examples: '60s', '10m', '24h', '7d'
 */
export const JWT_REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION || '7d';

/**
 * JWT secret key.
 * Must be set in environment variables for security reasons.
 * Throws an error if not defined.
 */
export const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) throw new Error('JWT_SECRET is not defined');

// # Bcrypt configuration
/**
 * Number of salt rounds for Bcrypt hashing.
 * Defaults to 10 if not set in environment variables.
 * Higher values increase security but also increase computation time.
 */
export const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

// # 2FA configuration
/**
 * Whether Two-Factor Authentication (2FA) is enabled.
 * Defaults to false if not set in environment variables.
 * If enabled, 2FA_SECRET must also be defined.
 */
export const TWOFA_ENABLED = process.env['2FA_ENABLED'] === 'true';

/**
 * 2FA time window in steps (30 seconds each).
 * Defaults to 1 (30 seconds) if not set in environment variables.
 * Must be a non-negative integer.
 */
export const TWOFA_WINDOW = parseInt(process.env['2FA_WINDOW'] || '1', 10);
if (TWOFA_ENABLED && (isNaN(TWOFA_WINDOW) || TWOFA_WINDOW < 0))
  throw new Error('TWOFA_WINDOW must be a non-negative integer');

/**
 * Timeout for 2FA verification in seconds.
 * Defaults to 300 seconds (5 minutes) if not set in environment variables.
 * Must be a positive integer.
 */
export const TWOFA_LOGIN_TIMEOUT = parseInt(process.env['2FA_TIMEOUT'] || '300', 10); // 5 minutes default
if (isNaN(TWOFA_LOGIN_TIMEOUT) || TWOFA_LOGIN_TIMEOUT <= 0)
  throw new Error('TWOFA_LOGIN_TIMEOUT must be a positive integer');

/**
 * Validity period when the user don't need to re-verify 2FA in seconds.
 * Defaults to 300 seconds (5 minutes) if not set in environment variables.
 * Must be a positive integer.
 */
export const TWOFA_VALID_TIMEOUT = parseInt(process.env['2FA_VALID_TIMEOUT'] || '300', 10); // 5 minutes default
if (isNaN(TWOFA_VALID_TIMEOUT) || TWOFA_VALID_TIMEOUT <= 0)
  throw new Error('TWOFA_VALID_TIMEOUT must be a positive integer');
