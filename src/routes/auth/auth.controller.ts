import { Controller, HttpCode, HttpStatus, Post, Request as NestRequest, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Public } from '../../decorators/public.decorator';
import type { FastifyRequest } from 'fastify';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@NestRequest() req: FastifyRequest) {
    if (!req.user) throw new Error('User not found on request');
    const accessToken = await this.authService.login(req.user.id);

    return { access_token: accessToken };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/profile')
  getProfile(@NestRequest() req: FastifyRequest) {
    return req.user;
  }
}
