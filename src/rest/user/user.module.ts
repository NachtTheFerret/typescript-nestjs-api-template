import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntityService } from 'src/services/prisma/entities/user-entity.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UserEntityService],
  exports: [UserService],
})
export class UserModule {}
