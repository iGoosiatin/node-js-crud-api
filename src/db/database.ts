import { withId } from '../types/common';

export type sourceType = 'users';

export interface IDatabase {
  selectAll<T>(source: sourceType): Promise<withId<T>[]>;
  selectOneById<T>(source: sourceType, id: string): Promise<withId<T> | null>;
  create<T>(source: sourceType, data: T): Promise<withId<T>>;
  updateById<T>(source: sourceType, id: string, data: Partial<T>): Promise<withId<T> | null>;
  deleteById(source: sourceType, id: string): Promise<true | null>;
}

export type DatabaseMethod = keyof IDatabase;
