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
  ConflictException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';

@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'Access token is missing or invalid',
})
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
    isArray: true,
    type: User,
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
  @ApiConflictResponse({
    description: 'Login already exists',
  })
  @Post()
  @HttpCode(StatusCodes.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    const maybeCreatedUser = await this.userService.create(createUserDto);
    if (maybeCreatedUser === null) {
      throw new ConflictException('Login already exists');
    }
    return maybeCreatedUser;
  }

  @ApiOperation({
    summary: 'Get single user by id',
    description: 'Get single user by id',
  })
  @ApiParam({ name: 'userId', format: 'uuid' })
  @ApiOkResponse({
    description: 'Successful operation',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'User id is invalid (not uuid)',
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
  @ApiParam({ name: 'userId', format: 'uuid' })
  @ApiOkResponse({
    description: 'The user has been updated',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'User id is invalid (not uuid)',
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
  @ApiParam({ name: 'userId', format: 'uuid' })
  @ApiNoContentResponse({
    description: 'The user has been deleted',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiBadRequestResponse({
    description: 'User id is invalid (not uuid)',
  })
  @Delete(':userId')
  @HttpCode(StatusCodes.NO_CONTENT)
  async remove(@Param('userId', ParseUUIDPipe) id: string) {
    const maybeUser = await this.userService.remove(id);

    if (maybeUser === null) {
      throw new NotFoundException(`There is no user with id ${id}`);
    }
  }
}
