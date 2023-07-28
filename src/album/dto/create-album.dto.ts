import { IsInt, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNullable } from '../../utils/class-validator/isNullable';

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
  })
  @IsUUID(4)
  @IsNullable()
  readonly artistId: string | null;
}
