import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/users/user.service';
import * as bcrypt from 'bcrypt';
// import { JWT_ACCESS_EXPIRATION, JWT_ACCESS_SECRET, JWT_REFRESH_EXPIRATION, JWT_REFRESH_SECRET } from '../constants';
// import { parseDuration } from 'src/utils/duration';
import { User } from '@prisma/client';

export interface JwtPayload {
  sub: string; // Subject (user ID)
  type: 'access' | 'refresh'; // Token type
  iat: number; // Issued at timestamp
  exp: number; // Expiration timestamp
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  /**
   * Login user and return JWT tokens
   * @param email
   * @param password
   * @returns Access and Refresh tokens
   * @throws UnauthorizedException if credentials are invalid
   */
  // async login(email: string, password: string): Promise<AuthTokens> {
  //   const user = await this.validateUser(email, password);
  //   const accessToken = await this.generateAccessTokenForUserId(user.id);
  //   const refreshToken = await this.generateRefreshTokenForUserId(user.id);

  //   return { accessToken, refreshToken };
  // }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userService.find({ email: username }, { omit: { password: false } });
    if (!user || !user.password) throw new UnauthorizedException('Invalid credentials');

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  // /**
  //  * Refresh tokens
  //  * @param refreshToken The refresh token to verify and use for generating new tokens
  //  * @param alsoReturnNewRefreshToken Whether to also return a new refresh token instead of reusing the old one
  //  * @returns New access token and optionally a new refresh token
  //  * @throws UnauthorizedException if the refresh token is invalid or the user no longer exists
  //  */
  // async refresh(refreshToken: string, alsoReturnNewRefreshToken = false): Promise<AuthTokens> {
  //   const payload: JwtPayload = await this.jwtService.verifyAsync(refreshToken, { secret: JWT_REFRESH_SECRET });
  //   if (payload.type !== 'refresh') throw new UnauthorizedException('Invalid token type');

  //   const user = await this.userService.get(payload.sub);
  //   if (!user) throw new UnauthorizedException('User not found');

  //   const accessToken = await this.generateAccessTokenForUserId(user.id);

  //   let refreshTokenToReturn = refreshToken;
  //   if (alsoReturnNewRefreshToken) refreshTokenToReturn = await this.generateRefreshTokenForUserId(user.id);

  //   return { accessToken, refreshToken: refreshTokenToReturn };
  // }

  // /**
  //  * Generate JWT access token for a given user ID
  //  * @param userId The user ID to include in the token's subject
  //  * @returns The signed JWT access token
  //  */
  // async generateAccessTokenForUserId(userId: string): Promise<string> {
  //   const now = Math.floor(Date.now() / 1000);
  //   return this.jwtService.signAsync(
  //     { sub: userId, type: 'access', iat: now, exp: now + parseDuration(JWT_ACCESS_EXPIRATION) },
  //     { secret: JWT_ACCESS_SECRET, expiresIn: JWT_ACCESS_EXPIRATION }
  //   );
  // }

  // /**
  //  * Generate JWT refresh token for a given user ID
  //  * @param userId The user ID to include in the token's subject
  //  * @returns The signed JWT refresh token
  //  */
  // async generateRefreshTokenForUserId(userId: string): Promise<string> {
  //   const now = Math.floor(Date.now() / 1000);
  //   return this.jwtService.signAsync(
  //     { sub: userId, type: 'refresh', iat: now, exp: now + parseDuration(JWT_REFRESH_EXPIRATION) },
  //     { secret: JWT_REFRESH_SECRET, expiresIn: JWT_REFRESH_EXPIRATION }
  //   );
  // }

  // /**
  //  * Validate a JWT access token and return its payload
  //  * @param token The JWT access token to validate
  //  * @returns The token's payload if valid
  //  * @throws UnauthorizedException if the token is invalid or expired
  //  */
  // async validateAccessToken(token: string): Promise<JwtPayload> {
  //   const payload: JwtPayload = await this.jwtService.verifyAsync(token, { secret: JWT_ACCESS_SECRET });
  //   if (payload.type !== 'access') throw new UnauthorizedException('Invalid token type');
  //   if (Date.now() >= payload.exp * 1000) throw new UnauthorizedException('Token expired');
  //   return payload;
  // }
}
