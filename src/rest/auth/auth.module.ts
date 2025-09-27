import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserEntityService } from '../../services/prisma/entities/user-entity.service';
import { SessionEntityService } from '../../services/prisma/entities/session-entity.service';
import { JWT_ACCESS_EXPIRATION, JWT_SECRET } from './constants';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
      signOptions: { expiresIn: JWT_ACCESS_EXPIRATION },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, UserEntityService, SessionEntityService],
  exports: [AuthService],
})
export class AuthModule {}
