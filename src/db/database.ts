export type sourceType = 'users';

export interface IDatabase {
  selectAll(source: sourceType): Promise<unknown[]>;
  selectOneById(source: sourceType, id: string): Promise<unknown>;
  create(source: sourceType, data: any): Promise<unknown>;
  updateById(source: sourceType, id: string, data: any): Promise<unknown | null>;
  deleteById(source: sourceType, id: string): Promise<true | null>;
}

export type DatabaseMethod = keyof IDatabase;
