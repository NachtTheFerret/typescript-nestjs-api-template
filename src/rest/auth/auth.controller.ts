import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public } from './decorators/public.decorator';
import type { LoginSessionMetadata } from '../../types';
import { AuthSignupDto } from './dto/auth-signup.dto';
import { AuthRefreshDto } from './dto/auth-refresh.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  public async login(@Request() req: FastifyRequest) {
    if (!req.user) throw new Error('User not found'); // This should never happen due to the guard

    const ip = req.ip || (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || null;
    const userAgent = req.headers['user-agent'] || null;
    const device = req.headers['sec-ch-ua-mobile'] === '?1' ? 'Mobile' : 'Desktop';
    const deviceName = req.headers['sec-ch-ua'] || null;
    const metadata = { ip, userAgent, device: deviceName || device } as LoginSessionMetadata;

    const { accessToken, refreshToken } = await this.authService.login(req.user.id, metadata);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      message: 'Login successful',
    };
  }

  @Public()
  @Post('signup')
  public async signup(@Body() body: AuthSignupDto) {
    const user = await this.authService.signup(body.username, body.password);

    return {
      id: user.id,
      message: 'User created successfully',
    };
  }

  @Get('profile')
  public profile(@Request() req: FastifyRequest) {
    if (!req.user) throw new Error('User not found');
    return req.user;
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  public async refresh(@Body() body: AuthRefreshDto) {
    const { accessToken, refreshToken } = await this.authService.refresh(body.refresh_token);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      message: 'Token refreshed successfully',
    };
  }
}
