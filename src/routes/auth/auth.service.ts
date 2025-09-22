import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

export interface JwtPayload {
  sub: string; // Subject (user ID)
  type: 'access' | 'refresh'; // Token type
  iat: number; // Issued at timestamp
  exp: number; // Expiration timestamp
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  /**
   * Validate user credentials
   * @param username
   * @param password
   * @returns User if valid, otherwise throws UnauthorizedException
   */
  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userService.find({ email: username }, { omit: { password: false } });
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
  async login(sub: string) {
    return this.generateJwtToken({ sub });
  }

  /**
   * Generate JWT token
   * @param payload Partial payload to include in the token
   * @returns Generated JWT token
   */
  async generateJwtToken(payload: Partial<JwtPayload>): Promise<string> {
    const iat = Math.floor(Date.now() / 1000);

    return this.jwtService.signAsync({ ...payload, iat, ...payload });
  }
}
