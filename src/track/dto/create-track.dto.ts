import { IsInt, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTrackDto {
  @ApiProperty({})
  @IsString()
  readonly name: string;

  @ApiProperty({
    format: 'uuid',
    required: false,
    nullable: true,
  })
  @IsUUID(4)
  @IsOptional()
  readonly artistId: string | null;

  @ApiProperty({
    format: 'uuid',
    required: false,
    nullable: true,
  })
  @IsUUID(4)
  @IsOptional()
  readonly albumId: string | null;

  @ApiProperty({
    type: 'integer',
    description: 'In seconds',
  })
  @IsInt()
  readonly duration: number;
}
