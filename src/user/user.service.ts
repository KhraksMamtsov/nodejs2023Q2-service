import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { DatabaseService } from '../database/database.service';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly database: DatabaseService) {}
  async create(createUserDto: CreateUserDto) {
    const createdUser = await this.database.create<User>('user', {
      ...createUserDto,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return new User(createdUser);
  }

  async findAll() {
    const allUsers = await this.database.findAll<User>('user');
    return allUsers.map((x) => new User(x));
  }

  async findOne(id: string) {
    const maybeUser = await this.database.findOne<User>('user', id);
    if (maybeUser === null) {
      return null;
    } else {
      return new User(maybeUser);
    }
  }

  async update(id: string, updatePasswordDto: UpdatePasswordDto) {
    const entity = await this.findOne(id);

    if (entity === null) {
      return null;
    } else if (entity.password !== updatePasswordDto.oldPassword) {
      return 'wrong-password';
    } else {
      const updatedUser = await this.database.update<User>('user', id, {
        updatedAt: Date.now(),
        version: entity.version + 1,
        password: updatePasswordDto.newPassword,
      });
      if (updatedUser === null) {
        return null;
      } else {
        return new User(updatedUser);
      }
    }
  }

  async remove(id: string) {
    const deletedUser = await this.database.delete<User>('user', id);

    if (deletedUser === null) {
      return null;
    } else {
      return new User(deletedUser);
    }
  }
}
