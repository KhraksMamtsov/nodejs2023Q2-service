import { Exclude } from 'class-transformer';

export class User {
  @Exclude()
  readonly password: string;

  readonly id: string;
  readonly login: string;
  readonly version: number; // integer number, increments on update
  readonly createdAt: number; // timestamp of creation
  readonly updatedAt: number; // timestamp of last update

  constructor(args: User) {
    Object.assign(this, args);
  }
}
