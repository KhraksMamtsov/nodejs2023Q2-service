import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsUUID } from 'class-validator';
import { IsNullable } from '../../utils/class-validator/isNullable';
import { IsUndefinable } from '../../utils/class-validator/isUndefinable';

export class UpdateAlbumDto {
  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsUndefinable()
  readonly name?: string | undefined;

  @ApiProperty({
    type: 'integer',
    required: false,
  })
  @IsInt()
  @IsUndefinable()
  readonly year?: number | undefined;

  @ApiProperty({
    format: 'uuid',
    nullable: true,
    required: false,
  })
  @IsUUID(4)
  @IsNullable()
  @IsUndefinable()
  readonly artistId?: string | null | undefined;
}
