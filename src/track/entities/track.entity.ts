import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

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
    required: false,
  })
  @IsOptional()
  readonly artistId: string | null;

  @ApiProperty({
    format: 'uuid',
    nullable: true,
    required: false,
  })
  @IsOptional()
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
