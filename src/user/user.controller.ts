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
  Res,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { Response } from 'express';

// @UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(StatusCodes.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const maybeUser = await this.userService.findOne(id);
    if (maybeUser === null) {
      response.status(StatusCodes.NOT_FOUND);
      return;
    } else {
      return maybeUser;
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdatePasswordDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const maybeUpdateResult = await this.userService.update(id, updateUserDto);

    if (maybeUpdateResult === null) {
      response.status(StatusCodes.NOT_FOUND);
      return;
    } else if (maybeUpdateResult === 'wrong-password') {
      response.status(StatusCodes.FORBIDDEN);
      return;
    } else {
      return maybeUpdateResult;
    }
  }

  @Delete(':id')
  @HttpCode(StatusCodes.NO_CONTENT)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const maybeUser = await this.userService.remove(id);

    if (maybeUser === null) {
      response.status(StatusCodes.NOT_FOUND);
      return;
    } else {
      return maybeUser;
    }
  }
}
