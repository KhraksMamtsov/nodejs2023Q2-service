import { Injectable } from '@nestjs/common';
import * as crypto from 'node:crypto';

type TableName = 'user' | 'artist' | 'album';
type EntityType = { readonly id: string };

@Injectable()
export class DatabaseService {
  private readonly db: Readonly<Record<TableName, Map<string, EntityType>>> = {
    user: new Map(),
    artist: new Map(),
    album: new Map(),
  };

  async exists(tableName: TableName, id: string): Promise<boolean> {
    return this.db[tableName].has(id);
  }

  async findAll<T extends EntityType>(
    tableName: TableName,
  ): Promise<ReadonlyArray<T>> {
    return [...this.db[tableName].values()] as unknown as ReadonlyArray<T>;
  }

  async create<X>(
    tableName: TableName,
    entityArgs: Omit<X, keyof EntityType>,
  ): Promise<X & EntityType> {
    const id = crypto.randomUUID();
    const newEntity = { id, ...entityArgs };

    this.db[tableName].set(id, newEntity);

    return newEntity as X & EntityType;
  }

  async findOne<X extends EntityType>(
    tableName: TableName,
    id: string,
  ): Promise<X | null> {
    return (this.db[tableName].get(id) as X | undefined) ?? null;
  }

  async delete<X>(
    tableName: TableName,
    id: string,
  ): Promise<(X & EntityType) | null> {
    const entity = await this.findOne(tableName, id);

    if (entity === null) {
      return null;
    } else {
      const deleteResult = this.db[tableName].delete(id);
      if (deleteResult) {
        return entity as X & EntityType;
      } else {
        return null;
      }
    }
  }

  async update<X>(
    tableName: TableName,
    id: string,
    partial: Partial<X>,
  ): Promise<(X & EntityType) | null> {
    const entity = await this.findOne(tableName, id);

    if (entity === null) {
      return null;
    } else {
      const newEntity = { ...entity, ...partial };

      this.db[tableName].set(id, newEntity);

      return newEntity as X & EntityType;
    }
  }
}
