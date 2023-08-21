import { ApiProperty } from '@nestjs/swagger';
import { IsJWT } from 'class-validator';

export class Auth {
  @ApiProperty({
    description: 'Access token',
    format: 'jwt',
  })
  @IsJWT()
  accessToken: string;

  @ApiProperty({
    description: 'Refresh token',
    format: 'jwt',
  })
  @IsJWT()
  refreshToken: string;

  constructor(args: Auth) {
    Object.assign(this, args);
  }
}
