import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
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
