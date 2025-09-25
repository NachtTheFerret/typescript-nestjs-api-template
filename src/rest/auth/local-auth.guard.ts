import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Local authentication guard using Passport's local strategy
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
