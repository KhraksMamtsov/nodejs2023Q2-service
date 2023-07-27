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
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    description: 'Get all users',
    summary: 'Get all users',
  })
  @ApiOkResponse({
    description: 'Successful operation',
    type: [User],
  })
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({
    description: 'Create a new user',
    summary: 'Create user',
  })
  @ApiCreatedResponse({
    description: 'The user has been created',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'Body does not contain required fields',
  })
  @Post()
  @HttpCode(StatusCodes.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({
    summary: 'Get single user by id',
    description: 'Get single user by id',
  })
  @ApiOkResponse({
    description: 'Successful operation',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'userId is invalid (not uuid)',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @Get(':userId')
  async findOne(@Param('userId', ParseUUIDPipe) userId: string) {
    const maybeUser = await this.userService.findOne(userId);
    if (maybeUser === null) {
      throw new NotFoundException(`There is no user with id ${userId}`);
    } else {
      return maybeUser;
    }
  }

  @ApiOperation({
    summary: "Update a user's password",
    description: "Updates a user's password by ID",
  })
  @ApiOkResponse({
    description: 'The user has been updated',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'userId is invalid (not uuid)',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiForbiddenResponse({
    description: 'Old password is wrong',
  })
  @Put(':userId')
  async update(
    @Param('userId', ParseUUIDPipe) id: string,
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

  @ApiOperation({
    summary: 'Delete user',
    description: 'Deletes user by ID',
  })
  @ApiNoContentResponse({
    description: 'The user has been deleted',
    type: User,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @Delete(':userId')
  @HttpCode(StatusCodes.NO_CONTENT)
  async remove(@Param('userId', ParseUUIDPipe) id: string) {
    const maybeUser = await this.userService.remove(id);

    if (maybeUser === null) {
      throw new NotFoundException(`There is no user with id ${id}`);
    } else {
      return maybeUser;
    }
  }
}
