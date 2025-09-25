import type { Session, User } from '@prisma/client';
import type { JwtPayload } from 'src/rest/auth/auth.service';

interface AuthInfoJwt {
  type: 'jwt';
  payload: JwtPayload;
}

interface AuthInfoLocal {
  type: 'local';
}

type AuthInfo = AuthInfoJwt | AuthInfoLocal;

declare module 'fastify' {
  interface FastifyRequest {
    user?: User;
    session?: Session;
    authInfo?: AuthInfo;
    isPublic?: boolean; // Indicates if the route is public (no authentication required)
    is2faNeeded?: boolean; // Indicates if 2FA is required for the route
  }
}
