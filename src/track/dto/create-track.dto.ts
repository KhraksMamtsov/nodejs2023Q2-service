import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  readonly name: string;

  @IsUUID(4)
  @IsOptional()
  readonly artistId: string | null; // refers to Artist

  @IsUUID(4)
  @IsOptional()
  readonly albumId: string | null; // refers to Album

  @IsNumber()
  readonly duration: number; // integer number
}
