import { withId } from '../types/common';

export type sourceType = 'users';

export interface IDatabase {
  selectAll<T>(source: sourceType): Promise<T[]>;
  selectOneById<T>(source: sourceType, id: string): Promise<T | null>;
  create<T>(source: sourceType, data: T): Promise<withId<T>>;
  updateById<T>(source: sourceType, id: string, data: T): Promise<withId<T> | null>;
  deleteById(source: sourceType, id: string): Promise<true | null>;
}

export type DatabaseMethod = keyof IDatabase;
