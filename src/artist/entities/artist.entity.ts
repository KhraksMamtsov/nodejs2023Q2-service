import { ApiProperty } from '@nestjs/swagger';

export class Artist {
  @ApiProperty({
    format: 'uuid',
  })
  readonly id: string;

  @ApiProperty({
    example: 'Freddie Mercury',
  })
  readonly name: string;

  @ApiProperty({
    example: false,
  })
  readonly grammy: boolean;

  constructor(args: Artist) {
    Object.assign(this, args);
  }
}
