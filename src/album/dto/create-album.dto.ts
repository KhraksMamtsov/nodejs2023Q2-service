import { IsInt, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAlbumDto {
  @ApiProperty()
  @IsString()
  readonly name: string;

  @ApiProperty({
    type: 'integer',
  })
  @IsInt()
  readonly year: number;

  @ApiProperty({
    format: 'uuid',
    nullable: true,
    required: false,
  })
  @IsUUID(4)
  @IsOptional()
  readonly artistId: string | null;
}
