import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  Res,
  Put,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { Response } from 'express';
import { UpdatePasswordDto } from '../user/dto/update-password.dto';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post()
  @HttpCode(StatusCodes.CREATED)
  create(@Body() createArtistDto: CreateArtistDto) {
    return this.artistService.create(createArtistDto);
  }

  @Get()
  findAll() {
    return this.artistService.findAll();
  }

  @HttpCode(StatusCodes.OK)
  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const maybeArtist = await this.artistService.findOne(id);
    if (maybeArtist === null) {
      response.status(StatusCodes.NOT_FOUND);
      return;
    } else {
      return maybeArtist;
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateArtistDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const maybeArtist = await this.artistService.update(id, updateUserDto);

    if (maybeArtist === null) {
      response.status(StatusCodes.NOT_FOUND);
      return;
    } else {
      return maybeArtist;
    }
  }

  @Delete(':id')
  @HttpCode(StatusCodes.NO_CONTENT)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const maybeArtist = await this.artistService.remove(id);

    if (maybeArtist === null) {
      response.status(StatusCodes.NOT_FOUND);
      return;
    } else {
      return maybeArtist;
    }
  }
}
