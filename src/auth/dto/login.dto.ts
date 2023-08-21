import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: "The user's login",
  })
  @IsString()
  login: string;

  @ApiProperty({
    description: "The user's password",
  })
  @IsString()
  password: string;
}
