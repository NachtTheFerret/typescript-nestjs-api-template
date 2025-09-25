import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import type { User, Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get a user by ID
   * @param id User ID
   * @param options Additional Prisma findUnique options
   * @returns User or null if not found
   */
  get(id: string, options: Omit<Prisma.UserFindUniqueArgs, 'where'> = {}): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id }, ...options });
  }

  /**
   * Find a user by criteria
   * @param where Search criteria
   * @param options Additional Prisma findFirst options
   * @returns User or null if not found
   */
  find(where: Prisma.UserWhereInput = {}, options: Omit<Prisma.UserFindFirstArgs, 'where'> = {}): Promise<User | null> {
    return this.prisma.user.findFirst({ where, ...options });
  }

  /**
   * Find a user by username
   * @param username Username
   * @param options Additional Prisma findFirst options
   * @returns User or null if not found
   */
  findByUsername(username: string, options: Omit<Prisma.UserFindFirstArgs, 'where'> = {}): Promise<User | null> {
    return this.prisma.user.findFirst({ where: { username }, ...options });
  }

  /**
   * Find multiple users by criteria
   * @param where Search criteria
   * @param options Additional Prisma findMany options
   * @returns Array of users
   */
  findMany(where: Prisma.UserWhereInput = {}, options: Omit<Prisma.UserFindManyArgs, 'where'> = {}): Promise<User[]> {
    return this.prisma.user.findMany({ where, ...options });
  }

  /**
   * Create a new user
   * @param data User data
   * @param options Additional Prisma create options
   * @returns Created user
   */
  create(data: Prisma.UserCreateInput, options: Omit<Prisma.UserCreateArgs, 'data'> = {}): Promise<User> {
    return this.prisma.user.create({ data, ...options });
  }

  /**
   * Create multiple users
   * @param data Array of user data
   * @param options Additional Prisma createMany options
   * @returns Batch payload with count of created records
   */
  createMany(
    data: Prisma.UserCreateManyInput[],
    options: Omit<Prisma.UserCreateManyArgs, 'data'> = {}
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.user.createMany({ data, ...options });
  }

  /**
   * Upsert a user (create or update)
   * @param where Unique criteria to find the user
   * @param createData Data to create if user does not exist
   * @param updateData Data to update if user exists
   * @param options Additional Prisma upsert options
   * @returns Upserted user
   */
  upsert(
    where: Prisma.UserWhereUniqueInput,
    createData: Prisma.UserCreateInput,
    updateData: Prisma.UserUpdateInput,
    options: Omit<Prisma.UserUpsertArgs, 'where' | 'create' | 'update'> = {}
  ): Promise<User> {
    return this.prisma.user.upsert({ where, create: createData, update: updateData, ...options });
  }

  /**
   * Update a user by ID
   * @param id User ID
   * @param data Data to update
   * @param options Additional Prisma update options
   * @returns Updated user
   */
  update(
    id: string,
    data: Prisma.UserUpdateInput,
    options: Omit<Prisma.UserUpdateArgs, 'where' | 'data'> = {}
  ): Promise<User> {
    return this.prisma.user.update({ where: { id }, data, ...options });
  }

  /**
   * Update multiple users by criteria
   * @param where Criteria to select users to update
   * @param data Data to update
   * @param options Additional Prisma updateMany options
   * @returns Batch payload with count of updated records
   */
  updateMany(
    where: Prisma.UserWhereInput,
    data: Prisma.UserUpdateManyMutationInput,
    options: Omit<Prisma.UserUpdateManyArgs, 'where' | 'data'> = {}
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.user.updateMany({ where, data, ...options });
  }

  /**
   * Delete a user by ID
   * @param id User ID
   * @param options Additional Prisma delete options
   * @returns Deleted user
   */
  delete(id: string, options: Omit<Prisma.UserDeleteArgs, 'where'> = {}): Promise<User> {
    return this.prisma.user.delete({ where: { id }, ...options });
  }

  /**
   * Delete multiple users by criteria
   * @param where Criteria to select users to delete
   * @param options Additional Prisma deleteMany options
   * @returns Batch payload with count of deleted records
   */
  deleteMany(
    where: Prisma.UserWhereInput,
    options: Omit<Prisma.UserDeleteManyArgs, 'where'> = {}
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.user.deleteMany({ where, ...options });
  }

  /**
   * Aggregate users by criteria
   * @param where Criteria to filter users
   * @param options Prisma aggregate options (excluding 'where')
   * @returns Aggregated user data
   */
  aggregate(where: Prisma.UserWhereInput = {}, options: Omit<Prisma.UserAggregateArgs, 'where'> = {}) {
    return this.prisma.user.aggregate({ where, ...options });
  }

  /**
   * Count users by criteria
   * @param where Criteria to count users
   * @param options Additional Prisma count options
   * @returns Count of users matching criteria
   */
  count(where: Prisma.UserWhereInput = {}, options: Omit<Prisma.UserCountArgs, 'where'> = {}) {
    return this.prisma.user.count({ where, ...options });
  }
}
