export type User = {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
};

export type UserFromRequest = Omit<User, 'id'>;