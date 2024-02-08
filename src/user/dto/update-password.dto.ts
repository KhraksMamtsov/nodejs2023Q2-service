import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty({
    description: "The user's old password",
  })
  @IsString()
  oldPassword: string;

  @ApiProperty({
    description: "The user's new password",
  })
  @IsString()
  newPassword: string;
}
