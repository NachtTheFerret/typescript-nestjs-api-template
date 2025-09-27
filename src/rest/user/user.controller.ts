import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { Pagination } from 'src/global/decorators/pagination.decorator';
import { PaginationDto } from 'src/global/dto/pagination.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  public async list(@Pagination() pagination: PaginationDto) {
    const items = await this.userService.list(pagination);
    const total = await this.userService.count();

    return {
      metadata: {
        total,
        offset: pagination.offset,
        limit: pagination.limit,
        count: items.length,
      },
      items,
      message: 'User list fetched successfully',
    };
  }
}
