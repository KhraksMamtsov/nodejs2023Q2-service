import { ApiProperty } from '@nestjs/swagger';

export class Track {
  @ApiProperty({
    format: 'uuid',
  })
  readonly id: string;

  @ApiProperty({
    example: 'The Show Must Go On',
  })
  readonly name: string;

  @ApiProperty({
    format: 'uuid',
    nullable: true,
  })
  readonly artistId: string | null;

  @ApiProperty({
    format: 'uuid',
    nullable: true,
  })
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
