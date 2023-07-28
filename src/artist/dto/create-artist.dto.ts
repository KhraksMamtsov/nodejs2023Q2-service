import { IsBoolean, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArtistDto {
  @ApiProperty()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsBoolean()
  readonly grammy: boolean;
}
