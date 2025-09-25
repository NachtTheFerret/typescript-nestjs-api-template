import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './rest/user/user.module';
import { AuthModule } from './rest/auth/auth.module';
import { PrismaService } from './services/prisma.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './rest/auth/jwt-auth.guard';
import { SessionModule } from './rest/session/session.module';

@Module({
  imports: [UserModule, AuthModule, SessionModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
