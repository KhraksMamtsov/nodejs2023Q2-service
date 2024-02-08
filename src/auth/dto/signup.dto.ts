import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignupDto {
  @ApiProperty({
    description: "The new user's login",
  })
  @IsString()
  login: string;

  @ApiProperty({
    description: "The new user's password",
  })
  @IsString()
  password: string;
}
