import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  ParseUUIDPipe,
  Res,
  Put,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { Response } from 'express';
import { UpdateArtistDto } from '../artist/dto/update-artist.dto';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  @HttpCode(StatusCodes.CREATED)
  create(@Body() createAlbumDto: CreateAlbumDto) {
    return this.albumService.create(createAlbumDto);
  }

  @Get()
  findAll() {
    return this.albumService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const maybeAlbum = await this.albumService.findOne(id);
    if (maybeAlbum === null) {
      response.status(StatusCodes.NOT_FOUND);
      return;
    } else {
      return maybeAlbum;
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateArtistDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const maybeAlbum = await this.albumService.update(id, updateUserDto);

    if (maybeAlbum === null) {
      response.status(StatusCodes.NOT_FOUND);
      return;
    } else {
      return maybeAlbum;
    }
  }

  @Delete(':id')
  @HttpCode(StatusCodes.NO_CONTENT)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const maybeAlbum = await this.albumService.remove(id);

    if (maybeAlbum === null) {
      response.status(StatusCodes.NOT_FOUND);
      return;
    } else {
      return maybeAlbum;
    }
  }
}
