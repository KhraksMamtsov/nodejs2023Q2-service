import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  Put,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({
    description: 'Get all users',
    summary: 'Get all users',
  })
  findAll() {
    return this.userService.findAll();
  }

  @Post()
  @HttpCode(StatusCodes.CREATED)
  @ApiOperation({
    description: 'Create a new user',
    summary: 'Create user',
  })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const maybeUser = await this.userService.findOne(id);
    if (maybeUser === null) {
      throw new NotFoundException(`There is no user with id ${id}`);
    } else {
      return maybeUser;
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdatePasswordDto,
  ) {
    const maybeUpdateResult = await this.userService.update(id, updateUserDto);

    if (maybeUpdateResult === null) {
      throw new NotFoundException(`There is no user with id ${id}`);
    } else if (maybeUpdateResult === 'wrong-password') {
      throw new ForbiddenException(
        `Wrong password old password ${updateUserDto.oldPassword}`,
      );
    } else {
      return maybeUpdateResult;
    }
  }

  @Delete(':id')
  @HttpCode(StatusCodes.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const maybeUser = await this.userService.remove(id);

    if (maybeUser === null) {
      throw new NotFoundException(`There is no user with id ${id}`);
    } else {
      return maybeUser;
    }
  }
}
