import { Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { UserService } from '../user/user.service';
import * as crypto from 'node:crypto';
import * as util from 'node:util';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { Auth } from './entities/auth.entity';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  private static saltEnvKey = 'CRYPT_SALT';
  public static jwtSecretEnvKey = 'JWT_SECRET_KEY';
  private static jwtSecretRefreshEnvKey = 'JWT_SECRET_REFRESH_KEY';
  private static tokenExpireTimeEnvKey = 'TOKEN_EXPIRE_TIME';
  private static tokenRefreshExpireTimeEnvKey = 'TOKEN_REFRESH_EXPIRE_TIME';
  private static hashPassword = util.promisify(crypto.pbkdf2);
  private readonly jwtSecret: string;
  private readonly jwtSecretRefresh: string;
  private readonly tokenExpireTime: string;
  private readonly tokenRefreshExpireTime: string;
  private readonly salt: string;

  constructor(
    configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {
    this.salt = configService.get(AuthService.saltEnvKey);
    this.jwtSecret = configService.get(AuthService.jwtSecretEnvKey);
    this.jwtSecretRefresh = configService.get(
      AuthService.jwtSecretRefreshEnvKey,
    );
    this.tokenExpireTime = configService.get(AuthService.tokenExpireTimeEnvKey);
    this.tokenRefreshExpireTime = configService.get(
      AuthService.tokenRefreshExpireTimeEnvKey,
    );
  }

  private async hashPassword(password: string) {
    return (
      await AuthService.hashPassword(password, this.salt, 1000, 64, `sha512`)
    ).toString(`hex`);
  }

  async signup(signupDto: SignupDto) {
    return this.userService.create({
      login: signupDto.login,
      password: await this.hashPassword(signupDto.password),
    });
  }

  async login(loginDto: LoginDto) {
    const usersWithLogin = await this.userService.findByLogin(loginDto.login);

    if (usersWithLogin.length === 0) {
      return null;
    } else if (usersWithLogin.length >= 2) {
      return 'many-users';
    } else {
      const user = usersWithLogin[0];

      const hashedPassword = await this.hashPassword(loginDto.password);

      if (user.password !== hashedPassword) {
        return 'wrong-password';
      }

      return this.generateAuth(user);
    }
  }

  private async generateAuth(user: User) {
    const payload = {
      sub: user.id,
      login: user.login,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.jwtSecret,
        expiresIn: this.tokenExpireTime,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.jwtSecretRefresh,
        expiresIn: this.tokenRefreshExpireTime,
      }),
    ]);

    return new Auth({
      accessToken,
      refreshToken,
    });
  }

  async refresh(refreshTokenDto: RefreshTokenDto) {
    try {
      await this.jwtService.verifyAsync(refreshTokenDto.refreshToken, {
        secret: this.jwtSecretRefresh,
      });
    } catch {
      return 'unverified-jwt';
    }

    try {
      const payload = this.jwtService.decode(refreshTokenDto.refreshToken, {
        json: true,
      });

      if (
        typeof payload !== 'string' &&
        'sub' in payload &&
        typeof payload['sub'] === 'string'
      ) {
        const maybeUser = await this.userService.findOne(payload['sub']);

        if (maybeUser === null) {
          return null;
        }

        return this.generateAuth(maybeUser);
      } else {
        return 'wrong-payload';
      }
    } catch {
      return 'jwt-decode-error';
    }
  }
}
