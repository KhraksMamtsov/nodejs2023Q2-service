import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';
import { IsUndefinable } from '../../utils/class-validator/isUndefinable';

export class UpdateArtistDto {
  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsUndefinable()
  readonly name?: string | undefined;

  @ApiProperty({
    required: false,
  })
  @IsBoolean()
  @IsUndefinable()
  readonly grammy?: boolean | undefined;
}
