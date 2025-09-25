import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { Prisma, Session } from '@prisma/client';

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get a session by ID
   * @param id Session ID
   * @param options Additional Prisma findUnique options
   * @returns Session or null if not found
   */
  get(id: string, options: Omit<Prisma.SessionFindUniqueArgs, 'where'> = {}): Promise<Session | null> {
    return this.prisma.session.findUnique({ where: { id }, ...options });
  }

  /**
   * Find a session by criteria
   * @param where Search criteria
   * @param options Additional Prisma findFirst options
   * @returns Session or null if not found
   */
  find(
    where: Prisma.SessionWhereInput = {},
    options: Omit<Prisma.SessionFindFirstArgs, 'where'> = {}
  ): Promise<Session | null> {
    return this.prisma.session.findFirst({ where, ...options });
  }

  /**
   * Find multiple sessions by criteria
   * @param where Search criteria
   * @param options Additional Prisma findMany options
   * @returns Array of sessions
   */
  findMany(
    where: Prisma.SessionWhereInput = {},
    options: Omit<Prisma.SessionFindManyArgs, 'where'> = {}
  ): Promise<Session[]> {
    return this.prisma.session.findMany({ where, ...options });
  }

  /**
   * Create a new session
   * @param data Session data
   * @param options Additional Prisma create options
   * @returns Created session
   */
  create(data: Prisma.SessionCreateInput, options: Omit<Prisma.SessionCreateArgs, 'data'> = {}): Promise<Session> {
    return this.prisma.session.create({ data, ...options });
  }

  /**
   * Create multiple sessions
   * @param data Array of session data
   * @param options Additional Prisma createMany options
   * @returns Batch payload with count of created records
   */
  createMany(
    data: Prisma.SessionCreateManyInput[],
    options: Omit<Prisma.SessionCreateManyArgs, 'data'> = {}
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.session.createMany({ data, ...options });
  }

  /**
   * Upsert a session (create or update)
   * @param where Unique criteria to find the session
   * @param createData Data to create if session does not exist
   * @param updateData Data to update if session exists
   * @param options Additional Prisma upsert options
   * @returns Upserted session
   */
  upsert(
    where: Prisma.SessionWhereUniqueInput,
    createData: Prisma.SessionCreateInput,
    updateData: Prisma.SessionUpdateInput,
    options: Omit<Prisma.SessionUpsertArgs, 'where' | 'create' | 'update'> = {}
  ): Promise<Session> {
    return this.prisma.session.upsert({ where, create: createData, update: updateData, ...options });
  }

  /**
   * Update a session by ID
   * @param id Session ID
   * @param data Data to update
   * @param options Additional Prisma update options
   * @returns Updated session
   */
  update(
    id: string,
    data: Prisma.SessionUpdateInput,
    options: Omit<Prisma.SessionUpdateArgs, 'where' | 'data'> = {}
  ): Promise<Session> {
    return this.prisma.session.update({ where: { id }, data, ...options });
  }

  /**
   * Update multiple sessions by criteria
   * @param where Criteria to select sessions to update
   * @param data Data to update
   * @param options Additional Prisma updateMany options
   * @returns Batch payload with count of updated records
   */
  updateMany(
    where: Prisma.SessionWhereInput,
    data: Prisma.SessionUpdateManyMutationInput,
    options: Omit<Prisma.SessionUpdateManyArgs, 'where' | 'data'> = {}
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.session.updateMany({ where, data, ...options });
  }

  /**
   * Delete a session by ID
   * @param id Session ID
   * @param options Additional Prisma delete options
   * @returns Deleted session
   */
  delete(id: string, options: Omit<Prisma.SessionDeleteArgs, 'where'> = {}): Promise<Session> {
    return this.prisma.session.delete({ where: { id }, ...options });
  }

  /**
   * Delete multiple sessions by criteria
   * @param where Criteria to select sessions to delete
   * @param options Additional Prisma deleteMany options
   * @returns Batch payload with count of deleted records
   */
  deleteMany(
    where: Prisma.SessionWhereInput,
    options: Omit<Prisma.SessionDeleteManyArgs, 'where'> = {}
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.session.deleteMany({ where, ...options });
  }

  /**
   * Aggregate sessions by criteria
   * @param where Criteria to filter sessions
   * @param options Prisma aggregate options (excluding 'where')
   * @returns Aggregated session data
   */
  aggregate(where: Prisma.SessionWhereInput = {}, options: Omit<Prisma.SessionAggregateArgs, 'where'> = {}) {
    return this.prisma.session.aggregate({ where, ...options });
  }

  /**
   * Count sessions by criteria
   * @param where Criteria to count sessions
   * @param options Additional Prisma count options
   * @returns Count of sessions matching criteria
   */
  count(where: Prisma.SessionWhereInput = {}, options: Omit<Prisma.SessionCountArgs, 'where'> = {}) {
    return this.prisma.session.count({ where, ...options });
  }
}
