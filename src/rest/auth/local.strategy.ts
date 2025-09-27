import { Strategy as LocalStrategyType } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
import { AuthInfoLocal } from '../../types/fastity';
import { FastifyRequest } from 'fastify';

/**
 * Local strategy for username/password authentication
 * Uses Passport's local strategy to validate and authenticate users based on username and password.
 * On successful validation, the user information and auth info are attached to the request object as `req.user` and `req.authInfo`.
 * If validation fails, an UnauthorizedException is thrown.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(LocalStrategyType) {
  constructor(private readonly authService: AuthService) {
    super({
      passReqToCallback: true,
    });
  }

  /**
   * Validate user credentials
   * @param username
   * @param password
   * @returns Authenticated user and auth info
   */
  async validate(request: FastifyRequest, username: string, password: string): Promise<[User, AuthInfoLocal]> {
    /**
     * Validate user credentials using AuthService
     */
    const user = await this.authService.validate(username, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const authInfo: AuthInfoLocal = { type: 'local', tfa: false };

    return [user, authInfo];
  }
}
