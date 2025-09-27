import { Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/global/dto/pagination.dto';
import { UserEntityService } from 'src/services/prisma/entities/user-entity.service';

@Injectable()
export class UserService {
  constructor(private readonly userEntityService: UserEntityService) {}

  public list(pagination: PaginationDto) {
    return this.userEntityService.findMany({}, { skip: pagination.offset, take: pagination.limit });
  }

  public count() {
    return this.userEntityService.count();
  }

  public get(id: string) {
    return this.userEntityService.get(id);
  }

  public findByUsername(username: string) {
    return this.userEntityService.find({ username });
  }
}
