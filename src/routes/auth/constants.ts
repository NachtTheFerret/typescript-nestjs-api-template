// JWT configuration
export const JWT_EXPIRATION = process.env.JWT_ACCESS_EXPIRATION || '1m';
export const JWT_SECRET = process.env.JWT_ACCESS_SECRET!;
if (!JWT_SECRET) throw new Error('JWT_ACCESS_SECRET is not defined');

// Bcrypt configuration
export const BCRYPT_SALT_ROUNDS = 10;
