import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import type { User, Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  get(id: string, options: Omit<Prisma.UserFindUniqueArgs, 'where'> = {}): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id }, ...options });
  }

  find(where: Prisma.UserWhereInput = {}, options: Omit<Prisma.UserFindFirstArgs, 'where'> = {}): Promise<User | null> {
    return this.prisma.user.findFirst({ where, ...options });
  }

  findMany(where: Prisma.UserWhereInput = {}, options: Omit<Prisma.UserFindManyArgs, 'where'> = {}): Promise<User[]> {
    return this.prisma.user.findMany({ where, ...options });
  }

  create(data: Prisma.UserCreateInput, options: Omit<Prisma.UserCreateArgs, 'data'> = {}): Promise<User> {
    return this.prisma.user.create({ data, ...options });
  }

  createMany(
    data: Prisma.UserCreateManyInput[],
    options: Omit<Prisma.UserCreateManyArgs, 'data'> = {}
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.user.createMany({ data, ...options });
  }

  upsert(
    where: Prisma.UserWhereUniqueInput,
    createData: Prisma.UserCreateInput,
    updateData: Prisma.UserUpdateInput,
    options: Omit<Prisma.UserUpsertArgs, 'where' | 'create' | 'update'> = {}
  ): Promise<User> {
    return this.prisma.user.upsert({ where, create: createData, update: updateData, ...options });
  }

  update(
    id: string,
    data: Prisma.UserUpdateInput,
    options: Omit<Prisma.UserUpdateArgs, 'where' | 'data'> = {}
  ): Promise<User> {
    return this.prisma.user.update({ where: { id }, data, ...options });
  }

  updateMany(
    where: Prisma.UserWhereInput,
    data: Prisma.UserUpdateManyMutationInput,
    options: Omit<Prisma.UserUpdateManyArgs, 'where' | 'data'> = {}
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.user.updateMany({ where, data, ...options });
  }

  delete(id: string, options: Omit<Prisma.UserDeleteArgs, 'where'> = {}): Promise<User> {
    return this.prisma.user.delete({ where: { id }, ...options });
  }

  deleteMany(
    where: Prisma.UserWhereInput,
    options: Omit<Prisma.UserDeleteManyArgs, 'where'> = {}
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.user.deleteMany({ where, ...options });
  }

  aggregate(options: Omit<Prisma.UserAggregateArgs, 'where'> = {}) {
    return this.prisma.user.aggregate({ ...options });
  }

  count(where: Prisma.UserWhereInput = {}, options: Omit<Prisma.UserCountArgs, 'where'> = {}) {
    return this.prisma.user.count({ where, ...options });
  }
}
