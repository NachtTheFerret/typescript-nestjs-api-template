/**
 * Application-wide constants
 * Includes app metadata and server configuration.
 * Loads values from environment variables with defaults where applicable.
 */

// Application metadata
export const APP_NAME = process.env.APP_NAME || 'NestJS API Template';
export const APP_VERSION = process.env.VERSION || '1.0.0';
export const APP_ISSUER = process.env.APP_ISSUER || 'NachtTheFerret';

// Server configuration
export const DEFAULT_PORT = process.env.PORT || 3000;
