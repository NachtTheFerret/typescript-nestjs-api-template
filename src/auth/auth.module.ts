import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/users/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { PrismaService } from 'src/services/prisma.service';

@Module({
  imports: [UserModule, PassportModule],
  providers: [AuthService, LocalStrategy, PrismaService],
  controllers: [AuthController],
})
export class AuthModule {}
