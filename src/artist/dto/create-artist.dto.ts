import { IsBoolean, IsString } from 'class-validator';

export class CreateArtistDto {
  @IsString()
  readonly name: string;

  @IsBoolean()
  readonly grammy: boolean;
}
