import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';
import { FastifyRequest } from 'fastify';
import { IS_2FA_NEEDED_KEY } from './decorators/2fa-needed.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    /** Check if the route is marked as public (no authentication required) */
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    /** Check if the route requires 2FA (Two-Factor Authentication) */
    const is2faNeeded = this.reflector.getAllAndOverride<boolean>(IS_2FA_NEEDED_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request: FastifyRequest = context.switchToHttp().getRequest();
    request.isPublic = isPublic;
    request.is2faNeeded = is2faNeeded;

    if (isPublic) return true;

    return super.canActivate(context);
  }
}
