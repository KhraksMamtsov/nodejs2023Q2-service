import {
  Controller,
  Post,
  Body,
  HttpCode,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../user/entities/user.entity';
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { LoginDto } from './dto/login.dto';
import { Auth } from './entities/auth.entity';
import { Public } from './auth.public.decorator';
import { RefreshTokenDto } from './dto/refreshToken.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    description: 'Signup a new user',
    summary: 'Signup user',
  })
  @ApiCreatedResponse({
    description: 'Successful signup',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'Body does not contain required fields',
  })
  @ApiConflictResponse({
    description: 'Login already exists',
  })
  @Public()
  @Post('signup')
  @HttpCode(StatusCodes.CREATED)
  async signup(@Body() signupDto: SignupDto) {
    const maybeNewUser = await this.authService.signup(signupDto);
    if (maybeNewUser === null) {
      throw new ConflictException('Login already exists');
    }
    return maybeNewUser;
  }

  @ApiOperation({
    description: 'Logins a user and returns a JWT-token',
    summary: 'Login',
  })
  @ApiOkResponse({
    description: 'Successful login',
    type: Auth,
  })
  @ApiBadRequestResponse({
    description: 'Body does not contain required fields',
  })
  @ApiConflictResponse({
    description: 'Several users with same login',
  })
  @ApiForbiddenResponse({
    description: 'There is no user with such login | Wrong password',
  })
  @Public()
  @Post('login')
  @HttpCode(StatusCodes.OK)
  async login(@Body() loginDto: LoginDto) {
    const loginResult = await this.authService.login(loginDto);

    if (loginResult === null) {
      throw new ForbiddenException(`There is no user with such login`);
    } else if (loginResult === 'many-users') {
      throw new ConflictException('Several users with same login');
    } else if (loginResult === 'wrong-password') {
      throw new ForbiddenException(`Wrong password`);
    }

    return loginResult;
  }

  @ApiOperation({
    description: "Refresh user's tokens",
    summary: 'Refresh',
  })
  @ApiOkResponse({
    description: 'Successful refresh',
    type: Auth,
  })
  @ApiBadRequestResponse({
    description:
      'Body does not contain required fields | Refresh token is invalid',
  })
  @ApiNotFoundResponse({
    description: 'There is no such user',
  })
  @Public()
  @Post('refresh')
  @HttpCode(StatusCodes.OK)
  async refresh(@Body() refreshDto: RefreshTokenDto) {
    const loginResult = await this.authService.refresh(refreshDto);

    if (loginResult === null) {
      throw new NotFoundException(`There is no such user`);
    } else if (
      loginResult === 'unverified-jwt' ||
      loginResult === 'jwt-decode-error' ||
      loginResult === 'wrong-payload'
    ) {
      throw new BadRequestException('Refresh token is invalid');
    }

    return loginResult;
  }
}
