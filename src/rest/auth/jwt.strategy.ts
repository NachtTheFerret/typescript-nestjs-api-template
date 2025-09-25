import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JWT_SECRET, TWOFA_VALID_TIMEOUT } from './constants';
import { JwtPayload } from './auth.service';
import { User } from '@prisma/client';
import { AuthInfoJwt } from '../../types/fastity';
import { UserService } from '../user/user.service';
import { FastifyRequest } from 'fastify';
import { SessionService } from '../session/session.service';

/**
 * JWT strategy for token authentication
 * Uses Passport's JWT strategy to validate and authenticate users based on JWT tokens.
 * The JWT is expected to be provided in the Authorization header as a Bearer token.
 * On successful validation, the user information and JWT payload are attached to the request object as `req.user` and `req.authInfo`.
 * If validation fails, an UnauthorizedException is thrown.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly sessionService: SessionService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
      passReqToCallback: true,
    });
  }

  /**
   * Validate JWT payload
   * @param payload JWT payload
   * @returns Authenticated user and auth info
   */
  async validate(request: FastifyRequest, payload: JwtPayload): Promise<[User | null, AuthInfoJwt]> {
    const authInfo: AuthInfoJwt = { type: 'jwt', payload };
    const user = await this.userService.get(payload.sub);

    /** If the route is marked as public, we allow access even if the user is not found. */
    if (request.isPublic) return [user || null, authInfo];

    /** For non-public routes, if the user is not found, we throw an UnauthorizedException. */
    if (!user) throw new UnauthorizedException('User not found');

    const session = await this.sessionService.find({ userId: user.id, code: payload.code });
    if (session) request.session = session;

    if (request.is2faNeeded && user.tfa) {
      /** If 2FA is required and the user has 2FA enabled, we check the session for recent 2FA verification. */
      if (!session) throw new UnauthorizedException('2FA verification required');
      if (!session.lastTfaAt) throw new UnauthorizedException('2FA verification required');

      const expiresAt = Date.now() + TWOFA_VALID_TIMEOUT * 1000;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      if (session.lastTfaAt.getTime() > expiresAt) throw new UnauthorizedException('2FA verification expired');
    }

    return [user, authInfo];
  }
}
