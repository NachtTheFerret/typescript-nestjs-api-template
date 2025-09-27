import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAuthGuard } from './rest/auth/jwt-auth.guard';

import { PrismaModule } from './services/prisma/prisma.module';
import { UserModule } from './rest/user/user.module';
import { AuthModule } from './rest/auth/auth.module';

@Module({
  imports: [
    /** Prisma integration module with global scope */
    PrismaModule,

    /** Event Emitter module with global scope */
    EventEmitterModule.forRoot({
      global: true,
      wildcard: true,
      delimiter: '.',
    }),

    /** Application modules */
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,

    /** Global JWT Auth Guard */
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
