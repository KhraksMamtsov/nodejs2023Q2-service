import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { DatabaseService } from '../database/database.service';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly database: DatabaseService) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const createdUser = await this.database.create('user', {
        ...createUserDto,
        version: 1,
      });

      return new User({
        ...createdUser,
        updatedAt: createdUser.updatedAt.getTime(),
        createdAt: createdUser.createdAt.getTime(),
      });
    } catch {
      return null;
    }
  }

  async findAll() {
    const allUsers = await this.database.findAll('user');
    return allUsers.map(
      (x) =>
        new User({
          ...x,
          updatedAt: x.updatedAt.getTime(),
          createdAt: x.createdAt.getTime(),
        }),
    );
  }

  async findOne(id: string) {
    const maybeUser = await this.database.findOne('user', id);
    if (maybeUser === null) {
      return null;
    } else {
      return new User({
        ...maybeUser,
        updatedAt: maybeUser.updatedAt.getTime(),
        createdAt: maybeUser.createdAt.getTime(),
      });
    }
  }

  async findByLogin(login: string) {
    const users = await this.database.findWhere('user', {
      login,
    });
    return users.map(
      (user) =>
        new User({
          ...user,
          updatedAt: user.updatedAt.getTime(),
          createdAt: user.createdAt.getTime(),
        }),
    );
  }

  async update(id: string, updatePasswordDto: UpdatePasswordDto) {
    const entity = await this.findOne(id);

    if (entity === null) {
      return null;
    } else if (entity.password !== updatePasswordDto.oldPassword) {
      return 'wrong-password';
    } else {
      const updatedUser = await this.database.update('user', id, {
        version: entity.version + 1,
        password: updatePasswordDto.newPassword,
      });
      if (updatedUser === null) {
        return null;
      } else {
        return new User({
          ...updatedUser,
          updatedAt: updatedUser.updatedAt.getTime(),
          createdAt: updatedUser.createdAt.getTime(),
        });
      }
    }
  }

  async remove(id: string) {
    const deletedUser = await this.database.delete('user', id);

    if (deletedUser === null) {
      return null;
    } else {
      return new User({
        ...deletedUser,
        updatedAt: deletedUser.updatedAt.getTime(),
        createdAt: deletedUser.createdAt.getTime(),
      });
    }
  }
}
