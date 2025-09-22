import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JWT_SECRET } from './constants';
import { JwtPayload } from './auth.service';
import { User } from '@prisma/client';
import { AuthInfoJwt } from 'src/types/express';
import { UserService } from '../users/user.service';

/**
 * JWT strategy for token authentication
 * Uses Passport's JWT strategy to validate and authenticate users based on JWT tokens.
 * The JWT is expected to be provided in the Authorization header as a Bearer token.
 * On successful validation, the user information and JWT payload are attached to the request object as `req.user` and `req.authInfo`.
 * If validation fails, an UnauthorizedException is thrown.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  /**
   * Validate JWT payload
   * @param payload JWT payload
   * @returns Authenticated user and auth info
   */
  async validate(payload: JwtPayload): Promise<[User, AuthInfoJwt]> {
    const user = await this.userService.get(payload.sub);
    if (!user) throw new UnauthorizedException('User not found');

    const authInfo: AuthInfoJwt = { type: 'jwt', payload };

    return [user, authInfo];
  }
}
