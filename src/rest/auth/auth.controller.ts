import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request as NestRequest,
  UseGuards,
  UnauthorizedException,
  Body,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService, LoginMetadata } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import type { FastifyRequest } from 'fastify';
import { TwoFactorAuthVerifyDto } from './dto/2fa-verify.dto';
import * as Swagger from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * User login endpoint
   * @param req Request object containing user info after local auth guard
   * @returns If 2FA is enabled, returns a message indicating 2FA is required along with a session code.
   *          If 2FA is not enabled, returns access and refresh tokens.
   * @throws UnauthorizedException if user is not found
   */
  // # Swagger documentation
  @Swagger.ApiOperation({ summary: 'User login' })
  @Swagger.ApiResponse({ status: 200, description: 'Login successful or 2FA required' })
  @Swagger.ApiResponse({ status: 401, description: 'Invalid credentials or 2FA verification failed' })
  @Swagger.ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'johndoe' },
        password: { type: 'string', example: 'strongpassword123' },
      },
      required: ['username', 'password'],
    },
  })
  @Swagger.ApiTags('auth')
  // # End Swagger documentation
  @Public() // No authentication required
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@NestRequest() req: FastifyRequest) {
    if (!req.user) throw new UnauthorizedException('User not found');

    const ip = req.ip || (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || null;
    const userAgent = req.headers['user-agent'] || null;
    const device = req.headers['sec-ch-ua-mobile'] === '?1' ? 'Mobile' : 'Desktop';
    const deviceName = req.headers['sec-ch-ua'] || null;
    const metadata = { ip, userAgent, device: deviceName || device } as LoginMetadata;

    const result = await this.authService.login(req.user.id, metadata);

    if (result.tfa) {
      /**
       * User has 2FA enabled, require 2FA verification
       * The user must complete the 2FA process to obtain the tokens.
       * The session code is provided to link the 2FA verification with this login attempt.
       */
      return {
        tfa: true,
        message: 'Two-factor authentication required',
        code: result.code,
      };
    } else {
      /**
       * User does not have 2FA enabled, return tokens immediately
       * The tokens include the session code for additional security.
       */
      return {
        tfa: false,
        message: 'Login successful',
        access_token: result.accessToken,
        refresh_token: result.refreshToken,
      };
    }
  }

  @Public()
  @Post('/2fa/verify')
  @HttpCode(HttpStatus.OK)
  async verifyTwoFactorAuth(@Body() { input, code }: TwoFactorAuthVerifyDto) {
    const result = await this.authService.verifyWithTwoFactorAuth(input, code);
    if (!result) throw new UnauthorizedException('Invalid 2FA verification request');

    return {
      message: '2FA verification successful',
      access_token: result.accessToken,
      refresh_token: result.refreshToken,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/2fa/enable')
  @HttpCode(HttpStatus.OK)
  async enableTwoFactorAuth(@NestRequest() req: FastifyRequest) {
    if (!req.user) throw new UnauthorizedException('User not found');

    await this.authService.enableTwoFactorAuth(req.user.id);

    return { message: 'Two-factor authentication enabled' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/2fa/disable')
  @HttpCode(HttpStatus.OK)
  async disableTwoFactorAuth(@NestRequest() req: FastifyRequest) {
    if (!req.user) throw new UnauthorizedException('User not found');

    await this.authService.disableTwoFactorAuth(req.user.id);

    return { message: 'Two-factor authentication disabled' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/profile')
  getProfile(@NestRequest() req: FastifyRequest) {
    return req.user;
  }
}
