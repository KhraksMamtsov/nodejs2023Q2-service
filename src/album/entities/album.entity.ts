import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { IsNullable } from '../../utils/class-validator/isNullable';

export class Album {
  @ApiProperty({
    format: 'uuid',
  })
  readonly id: string;

  @ApiProperty({
    example: 'Innuendo',
  })
  readonly name: string;

  @ApiProperty({
    type: 'integer',
    example: 1991,
  })
  readonly year: number;

  @ApiProperty({
    format: 'uuid',
    nullable: true,
  })
  @IsNullable()
  readonly artistId: string | null;

  constructor(args: Album) {
    Object.assign(this, args);
  }
}
