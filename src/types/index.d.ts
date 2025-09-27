export interface LoginSessionMetadata {
  /** IP address of the client */
  ip?: string | null;

  /** User-Agent string of the client */
  userAgent?: string | null;

  /** Device information (e.g., 'Mobile', 'Desktop', etc.) */
  device?: string | null;
}

export interface JwtPayload {
  /** Subject (user ID) */
  sub: string;

  /** Token type: 'access' or 'refresh' */
  type: 'access' | 'refresh';

  /** Session state for additional security */
  state: string;

  /** Issued at timestamp */
  iat: number;

  /** Expiration timestamp */
  exp: number;
}
