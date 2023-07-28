import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { IsNullable } from '../../utils/class-validator/isNullable';

export class Track {
  @ApiProperty({
    format: 'uuid',
  })
  readonly id: string; // uuid v4

  @ApiProperty({
    example: 'The Show Must Go On',
  })
  readonly name: string;

  @ApiProperty({
    format: 'uuid',
    nullable: true,
  })
  @IsNullable()
  readonly artistId: string | null;

  @ApiProperty({
    format: 'uuid',
    nullable: true,
  })
  @IsNullable()
  readonly albumId: string | null;

  @ApiProperty({
    example: 262,
    description: 'In seconds',
    type: 'integer',
  })
  readonly duration: number;

  constructor(args: Track) {
    Object.assign(this, args);
  }
}
