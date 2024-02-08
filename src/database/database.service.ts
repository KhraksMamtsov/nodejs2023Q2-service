import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

type TableName = 'user' | 'artist' | 'album' | 'track' | 'favorites';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private _prismaClient: PrismaClient = new PrismaClient();

  get prismaClient() {
    return this._prismaClient;
  }
  onModuleInit() {
    return this._prismaClient.$connect();
  }
  onModuleDestroy() {
    return this._prismaClient.$disconnect();
  }

  findWhere<T extends TableName>(
    tableName: T,
    where: Parameters<PrismaClient[T]['findMany']>[0]['where'],
  ): ReturnType<PrismaClient[T]['findMany']> {
    // @ts-expect-error : Each member of the union type has signatures, but none of those signatures are compatible with each other.
    return this._prismaClient[tableName].findMany({
      where,
    });
  }

  findAll<T extends TableName>(
    tableName: T,
  ): ReturnType<PrismaClient[T]['findMany']> {
    // @ts-expect-error : Each member of the union type has signatures, but none of those signatures are compatible with each other.
    return this._prismaClient[tableName].findMany();
  }

  create<T extends TableName>(
    tableName: T,
    data: Omit<Parameters<PrismaClient[T]['create']>[0]['data'], 'id'>,
    id?: string,
  ): ReturnType<PrismaClient[T]['create']> {
    // @ts-expect-error : Each member of the union type has signatures, but none of those signatures are compatible with each other.
    return this._prismaClient[tableName].create({
      data: {
        ...data,
        id,
      },
    });
  }

  findOne<T extends TableName>(
    tableName: T,
    id: string,
  ): ReturnType<PrismaClient[T]['findUnique']> {
    // @ts-expect-error : Each member of the union type has signatures, but none of those signatures are compatible with each other.
    return this._prismaClient[tableName].findUnique({
      where: { id },
    });
  }

  async delete<T extends TableName>(
    tableName: T,
    id: string,
  ): Promise<Awaited<ReturnType<PrismaClient[T]['delete']>> | null> {
    try {
      // @ts-expect-error : Each member of the union type has signatures, but none of those signatures are compatible with each other.
      return await this._prismaClient[tableName].delete({
        where: { id },
      });
    } catch {
      return null;
    }
  }

  async update<T extends TableName>(
    tableName: T,
    id: string,
    data: Parameters<PrismaClient[T]['update']>[0]['data'],
  ): Promise<null | Awaited<ReturnType<PrismaClient[T]['update']>>> {
    try {
      // @ts-expect-error : Each member of the union type has signatures, but none of those signatures are compatible with each other.
      return await this._prismaClient[tableName].update({
        where: { id },
        data,
      });
    } catch {
      return null;
    }
  }
}
