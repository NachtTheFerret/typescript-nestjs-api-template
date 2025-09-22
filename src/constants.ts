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
