import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

import { JWT_SECRET } from './constants';
import { AuthInfoJwt } from '../../types/fastity';
import { SessionEntityService } from '../../services/prisma/entities/session-entity.service';
import { UserEntityService } from '../../services/prisma/entities/user-entity.service';
import { JwtPayload } from 'src/types';

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
    private readonly userEntityService: UserEntityService,
    private readonly sessionEntityService: SessionEntityService
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
  async validate(request: FastifyRequest, payload: JwtPayload) {
    const authInfo: AuthInfoJwt = { type: 'jwt', payload, tfa: false };
    const user = await this.userEntityService.get(payload.sub);

    /** If the route is marked as public, we allow access even if the user is not found. */
    if (request.isPublic) return [user || null, authInfo];

    /** We only accept access tokens for authentication. */
    if (payload.type !== 'access') throw new UnauthorizedException('Invalid token type');

    /** For non-public routes, if the user is not found, we throw an UnauthorizedException. */
    if (!user) throw new UnauthorizedException('User not found');

    const session = await this.sessionEntityService.find({ state: payload.state });
    if (!session) throw new UnauthorizedException('Session not found');
    if (session.userId !== user.id) throw new UnauthorizedException('Session does not belong to the user');

    request.session = session;

    return [user, authInfo];
  }
}
