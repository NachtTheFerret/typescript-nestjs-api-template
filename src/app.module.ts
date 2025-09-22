import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './routes/users/user.module';
import { AuthModule } from './routes/auth/auth.module';
import { PrismaService } from './services/prisma.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './routes/auth/jwt-auth.guard';

@Module({
  imports: [UserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
