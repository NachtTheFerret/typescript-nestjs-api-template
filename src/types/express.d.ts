import type { User } from '@prisma/client';
import type { JwtPayload } from 'src/routes/auth/auth.service';

interface AuthInfoJwt {
  type: 'jwt';
  payload: JwtPayload;
}

interface AuthInfoLocal {
  type: 'local';
}

type AuthInfo = AuthInfoJwt | AuthInfoLocal;

declare module 'express' {
  interface Request {
    user?: User;
    authInfo?: AuthInfo;
  }
}
