import { ApiProperty } from '@nestjs/swagger';

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
  readonly artistId: string | null;

  constructor(args: Album) {
    Object.assign(this, args);
  }
}
