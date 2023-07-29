import { IsUndefinable } from '../../utils/class-validator/isUndefinable';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsUUID } from 'class-validator';
import { IsNullable } from '../../utils/class-validator/isNullable';

export class UpdateTrackDto {
  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsUndefinable()
  readonly name?: string | undefined;

  @ApiProperty({
    format: 'uuid',
    nullable: true,
    required: false,
  })
  @IsUUID(4)
  @IsNullable()
  @IsUndefinable()
  readonly artistId?: string | null | undefined;

  @ApiProperty({
    format: 'uuid',
    nullable: true,
    required: false,
  })
  @IsUUID(4)
  @IsNullable()
  @IsUndefinable()
  readonly albumId?: string | null | undefined;

  @ApiProperty({
    type: 'integer',
    description: 'In seconds',
    required: false,
  })
  @IsInt()
  @IsUndefinable()
  readonly duration?: number | undefined;
}
