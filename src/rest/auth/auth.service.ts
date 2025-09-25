import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { generateSecret, totp } from 'speakeasy';
import { APP_ISSUER, APP_NAME } from 'src/constants';
import { TWOFA_LOGIN_TIMEOUT, TWOFA_WINDOW } from './constants';
import { randomBytes } from 'crypto';
import { SessionService } from '../session/session.service';
import { User } from '@prisma/client';

export interface JwtPayload {
  /** Subject (user ID) */
  sub: string;

  /** Token type: 'access' or 'refresh' */
  type: 'access' | 'refresh';

  /** Session code for additional security */
  code: string;

  /** Issued at timestamp */
  iat: number;

  /** Expiration timestamp */
  exp: number;
}

export interface LoginSuccess {
  /**
   * JWT access token
   * Used for authenticating API requests.
   */
  accessToken: string;

  /**
   * JWT refresh token
   * Used to obtain new access tokens when the current one expires.
   */
  refreshToken: string;

  /**
   * Two-Factor Authentication (2FA) is not required for this login.
   * If 2FA were required, this would be true and additional steps would be needed to complete the login. {@see TwoFactorNeeded}
   */
  tfa: false;
}

export interface TwoFactorNeeded {
  /**
   * Two-Factor Authentication (2FA) is required for this login.
   * The user must provide a valid 2FA code to complete the login process.
   */
  tfa: true;

  /**
   * Session code
   * This code is used to link the 2FA verification step with the initial login attempt.
   * It should be included in the 2FA verification request.
   */
  code: string;
}

export interface LoginMetadata {
  ip?: string;
  userAgent?: string;
  device?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
    private readonly jwtService: JwtService
  ) {}

  /**
   * Validate user credentials
   * @param username
   * @param password
   * @returns True if valid, otherwise throws UnauthorizedException
   * @throws UnauthorizedException if credentials are invalid
   */
  async validateUserPassword(username: string, password: string): Promise<User> {
    const user = await this.userService.find({ username }, { omit: { password: false } });
    if (!user || !user.password) throw new UnauthorizedException('Invalid credentials');

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  /**
   * Login user and generate JWT token
   * @param sub User ID (subject)
   * @returns AuthTokens containing access token
   */
  async login(userId: string, metadata: LoginMetadata = {}) {
    const user = await this.userService.get(userId);
    if (!user) throw new NotFoundException('User not found');

    const code = this.generateSessionCode();
    const session = await this.sessionService.create({
      user: { connect: { id: userId } },
      code,
      ...metadata,
    });

    if (!user.tfa) {
      /**
       * User does not have 2FA enabled, generate tokens immediately
       * The tokens include the session code for additional security.
       * The session will remain valid until its natural expiration.
       */
      const accessToken = await this.generateJwtToken({ sub: userId, type: 'access', code });
      const refreshToken = await this.generateJwtToken({ sub: userId, type: 'refresh', code });

      return { accessToken, refreshToken, tfa: false } as LoginSuccess;
    } else {
      /**
       * Calculate session expiration time for 2FA
       * The session will expire in TWOFA_TIMEOUT seconds.
       * This ensures that if the 2FA process is not completed within this timeframe, the session becomes invalid.
       */
      const expiresAt = Date.now() + TWOFA_LOGIN_TIMEOUT * 1000;
      await this.sessionService.update(session.id, { expiredAt: new Date(expiresAt) });

      /**
       * User has 2FA enabled, require 2FA verification
       * The user must complete the 2FA process to obtain the tokens.
       * The session code is provided to link the 2FA verification with this login attempt.
       */

      return { tfa: true, code } as TwoFactorNeeded;
    }
  }

  /**
   * Generate a unique session code whose purpose is to add an additional layer of security to the JWT tokens.
   * @returns Generated session code
   */
  generateSessionCode(): string {
    return randomBytes(16).toString('hex');
  }

  /**
   * Generate JWT token
   * @param payload Partial payload to include in the token
   * @returns Generated JWT token
   */
  async generateJwtToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): Promise<string> {
    const iat = Math.floor(Date.now() / 1000);

    return this.jwtService.signAsync({ ...payload, iat, ...payload });
  }

  /**
   * Generate a new 2FA secret for a user
   * @returns Generated 2FA secret
   */
  generateTwoFactorAuthSecret() {
    return generateSecret({ length: 32, name: APP_NAME, issuer: APP_ISSUER });
  }

  /**
   * Get user's 2FA secret
   * @param userId User ID
   * @returns User's 2FA secret or null if not set
   * @throws NotFoundException if user does not exist
   */
  async getUserTwoFactorAuthSecret(userId: string): Promise<string> {
    const user = await this.userService.get(userId);
    if (!user) throw new NotFoundException('User not found');
    if (!user.tfa) throw new UnauthorizedException('2FA is not set up for this user');

    if (!user.tfaSecret) {
      // If the user does not have a 2FA secret, generate and save a new one
      const secret = this.generateTwoFactorAuthSecret();
      await this.userService.update(userId, { tfaSecret: secret.base32 });
      return secret.base32;
    }

    return user.tfaSecret;
  }

  /**
   * Enable 2FA for a user
   * @param userId User ID
   * @param secret 2FA secret to set
   * @returns void
   */
  async enableTwoFactorAuth(userId: string): Promise<void> {
    const user = await this.userService.get(userId);
    if (!user) throw new NotFoundException('User not found');
    if (user.tfa) throw new UnauthorizedException('2FA is already enabled for this user');

    const secret = this.generateTwoFactorAuthSecret();
    await this.userService.update(userId, { tfa: true, tfaSecret: secret.base32 });
  }

  /**
   * Disable 2FA for a user
   * @param userId User ID
   * @returns void
   */
  async disableTwoFactorAuth(userId: string): Promise<void> {
    const user = await this.userService.get(userId);
    if (!user) throw new NotFoundException('User not found');
    if (!user.tfa) throw new UnauthorizedException('2FA is not enabled for this user');

    await this.userService.update(userId, { tfa: false, tfaSecret: null });
  }

  /**
   * Validate a 2FA code for a user
   * @param userId User ID
   * @param code 2FA code to validate
   * @returns True if valid, otherwise false
   * @throws NotFoundException if user does not exist
   * @throws UnauthorizedException if 2FA is not set up for the user
   */
  async validateTwoFactorAuthCode(userId: string, code: string): Promise<User> {
    try {
      const user = await this.userService.get(userId);
      if (!user) throw new NotFoundException('User not found');
      if (!user.tfa) throw new UnauthorizedException('2FA is not set up for this user');

      const secret = await this.getUserTwoFactorAuthSecret(userId);
      const verified = totp.verify({ secret, encoding: 'base32', token: code, window: TWOFA_WINDOW });

      if (!verified) throw new UnauthorizedException('Invalid 2FA code');

      return user;
    } catch (error) {
      console.error('Error validating 2FA code:', error);
      throw new UnauthorizedException('Invalid 2FA code');
    }
  }

  /**
   * Complete login with 2FA verification
   * @param input 2FA code input by the user
   * @param code Session code from the initial login attempt
   * @returns LoginSuccess containing access and refresh tokens
   * @throws UnauthorizedException if session is invalid, expired, or 2FA code is incorrect
   */
  async verifyWithTwoFactorAuth(input: string, code: string): Promise<LoginSuccess> {
    const session = await this.sessionService.find({ code });
    if (!session) throw new UnauthorizedException('Invalid code');

    /**
     * Check if the session has expired
     * If the session has an expiration time and it is in the past, reject the login attempt.
     * This ensures that 2FA codes cannot be used indefinitely and must be verified within the allowed timeframe.
     */
    if (session.expiredAt && session.expiredAt < new Date()) throw new UnauthorizedException('Login attempt expired');

    const user = await this.validateTwoFactorAuthCode(session.userId, input);
    if (!user) throw new UnauthorizedException('Invalid 2FA code');

    const newcode = this.generateSessionCode();

    /**
     * Reset session expiration to null (no expiration) and update session code
     * The session will remain valid until explicitly invalidated (e.g., user logout).
     * Chance the session code to prevent someone to reuse the old code (if they got it and use it somehow).
     * Also update the lastTfaAt timestamp to the current time. This timestamp will be used to track when the last successful 2FA verification occurred.
     */
    await this.sessionService.update(session.id, { expiredAt: null, code: newcode, lastTfaAt: new Date() });

    const accessToken = await this.generateJwtToken({ sub: user.id, type: 'access', code: newcode });
    const refreshToken = await this.generateJwtToken({ sub: user.id, type: 'refresh', code: newcode });

    return { accessToken, refreshToken, tfa: false } as LoginSuccess;
  }
}
