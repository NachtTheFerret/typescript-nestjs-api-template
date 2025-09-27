import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { PaginationDto } from '../dto/pagination.dto';

interface PaginationParams {
  offset?: number;
  limit?: number;
}

export const Pagination = createParamDecorator((data: unknown, ctx: ExecutionContext): PaginationDto => {
  const request: FastifyRequest = ctx.switchToHttp().getRequest();
  const { offset, limit } = request.query as { offset?: string; limit?: string };

  const params: PaginationParams = {
    offset: offset ? parseInt(offset, 10) : 0,
    limit: limit ? parseInt(limit, 10) : 10,
  };

  return params;
});
