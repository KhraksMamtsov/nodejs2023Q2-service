import { IsInt, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNullable } from '../../utils/class-validator/isNullable';

export class CreateTrackDto {
  @ApiProperty({})
  @IsString()
  readonly name: string;

  @ApiProperty({
    format: 'uuid',
    nullable: true,
  })
  @IsUUID(4)
  @IsNullable()
  readonly artistId: string | null;

  @ApiProperty({
    format: 'uuid',
    nullable: true,
  })
  @IsUUID(4)
  @IsNullable()
  readonly albumId: string | null;

  @ApiProperty({
    type: 'integer',
    description: 'In seconds',
  })
  @IsInt()
  readonly duration: number;
}
