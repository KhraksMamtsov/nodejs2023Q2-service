import { ApiProperty } from '@nestjs/swagger';

export class Artist {
  @ApiProperty({
    format: 'uuid',
  })
  readonly id: string;

  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly grammy: boolean;

  constructor(args: Artist) {
    Object.assign(this, args);
  }
}
