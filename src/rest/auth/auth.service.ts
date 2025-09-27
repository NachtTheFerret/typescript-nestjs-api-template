import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

import { UserEntityService } from '../../services/prisma/entities/user-entity.service';
import { SessionEntityService } from '../../services/prisma/entities/session-entity.service';
import type { JwtPayload, LoginSessionMetadata } from '../../types';
import { BCRYPT_SALT_ROUNDS } from 'src/constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly userEntityService: UserEntityService,
    private readonly sessionEntityService: SessionEntityService,
    private readonly jwtService: JwtService
  ) {}

  /**
   * Validate user credentials
   * @param username
   * @param password
   * @returns True if valid, otherwise throws UnauthorizedException
   * @throws UnauthorizedException if credentials are invalid
   */
  public async validate(username: string, password: string) {
    const user = await this.userEntityService.find({ username }, { omit: { password: false } });
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
  async login(userId: string, metadata: LoginSessionMetadata = {}) {
    const user = await this.userEntityService.get(userId);
    if (!user) throw new NotFoundException('User not found');
    if (user.tfa) throw new UnauthorizedException('2FA verification required');

    const session = await this.createUserLoginSession(userId, { ...metadata });

    /**
     * User does not have 2FA enabled, generate tokens immediately
     * The tokens include the session state for additional security.
     * The session will remain valid until its natural expiration.
     */
    const accessToken = await this.generateJwtToken({ sub: user.id, type: 'access', state: session.state });
    const refreshToken = await this.generateJwtToken({ sub: user.id, type: 'refresh', state: session.state });

    return { accessToken, refreshToken, session };
  }

  /**
   * Signup a new user
   * @param username
   * @param password
   * @returns Created user
   * @throws UnauthorizedException if username is already takens
   */
  public async signup(username: string, password: string) {
    const existingUser = await this.userEntityService.find({ username });
    if (existingUser) throw new UnauthorizedException('Username already taken');

    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    const newUser = await this.userEntityService.create({ username, password: hashedPassword });

    return newUser;
  }

  /**
   * Refresh JWT tokens using a valid refresh token
   * @param refreshToken The refresh token
   * @returns New access and refresh tokens
   * @throws UnauthorizedException if the token is invalid or the session/user is not found
   * @throws UnauthorizedException if the session has expired
   * @throws UnauthorizedException if the session does not belong to the user
   * @throws UnauthorizedException if the token type is not 'refresh'
   */
  public async refresh(refreshToken: string) {
    try {
      /** Verify and decode the refresh token */
      const payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken);
      if (payload.type !== 'refresh') throw new UnauthorizedException('Invalid token type');

      /** Fetch the user and session associated with the token */
      const user = await this.userEntityService.get(payload.sub);
      if (!user) throw new UnauthorizedException('User not found');

      /** Ensure the session is valid and belongs to the user */
      const session = await this.sessionEntityService.find({ state: payload.state });
      if (!session) throw new UnauthorizedException('Session not found');
      if (session.userId !== user.id) throw new UnauthorizedException('Session does not belong to the user');

      /** If the session has expired, delete it and throw an error */
      if (session.expiredAt && session.expiredAt < new Date()) {
        await this.sessionEntityService.delete(session.id);
        throw new UnauthorizedException('Session has expired');
      }

      /** Generate a new session state to invalidate old tokens */
      const newSessionState = await this.generateSessionState(user.id);
      await this.sessionEntityService.update(session.id, { state: newSessionState });

      /** Generate new tokens */
      const accessToken = await this.generateJwtToken({ sub: user.id, type: 'access', state: newSessionState });
      const newRefreshToken = await this.generateJwtToken({ sub: user.id, type: 'refresh', state: newSessionState });

      return { accessToken, refreshToken: newRefreshToken, session };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Generate a unique session state whose purpose is to add an additional layer of security to the JWT tokens.
   * @returns Generated session state
   */
  public async generateSessionState(userId: string): Promise<string> {
    const now = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    const base = `${userId}:${now}:${random}`;
    const hash = await bcrypt.hash(base, BCRYPT_SALT_ROUNDS);
    return hash.replace(/\//g, '_').replace(/\./g, '-'); // Replace '/' and '.' to make it URL-safe
  }

  /**
   * Create a user login session
   * @param userId User ID
   * @param data Optional session data
   * @returns Created session
   * @throws NotFoundException if user does not exist
   */
  public async createUserLoginSession(userId: string, data: Record<string, any> = {}) {
    const user = await this.userEntityService.get(userId);
    if (!user) throw new NotFoundException('User not found');

    const state = await this.generateSessionState(user.id);

    return this.sessionEntityService.create({
      user: { connect: { id: userId } },
      state,
      ...data,
    });
  }

  /**
   * Generate JWT token
   * @param payload Partial payload to include in the token
   * @returns Generated JWT token
   */
  public async generateJwtToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): Promise<string> {
    const iat = Math.floor(Date.now() / 1000);
    return this.jwtService.signAsync({ ...payload, iat });
  }
}
