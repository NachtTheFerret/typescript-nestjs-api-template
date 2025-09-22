import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  public async list(@Query('offset') offset?: string, @Query('limit') limit?: string) {
    const take = limit ? parseInt(limit, 10) : undefined;
    const skip = offset ? parseInt(offset, 10) : undefined;
    const items = await this.userService.findMany({}, { take, skip });
    const total = await this.userService.count();

    return {
      metadata: {
        offset: skip,
        limit: take,
        count: items.length,
        total,
      },
      items,
      message: 'Users retrieved successfully',
      status: 200,
    };
  }
}
