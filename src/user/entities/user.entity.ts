import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class User {
  @Exclude()
  readonly password: string;

  @ApiProperty({
    format: 'uuid',
  })
  readonly id: string;

  @ApiProperty({
    example: 'TestUser',
  })
  readonly login: string;

  @ApiProperty({
    example: 1,
  })
  readonly version: number; // integer number, increments on update

  @ApiProperty({
    example: 1655000000,
  })
  readonly createdAt: number; // timestamp of creation

  @ApiProperty({
    example: 1655000000,
  })
  readonly updatedAt: number; // timestamp of last update

  constructor(args: User) {
    Object.assign(this, args);
  }
}
