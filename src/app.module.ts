import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
  providers: [AppService],
})
export class AppModule {}
