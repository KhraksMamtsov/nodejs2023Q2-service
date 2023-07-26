import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  ParseUUIDPipe,
  Res,
  Put,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { CreateAlbumDto } from '../album/dto/create-album.dto';
import { Response } from 'express';
import { UpdateArtistDto } from '../artist/dto/update-artist.dto';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post()
  @HttpCode(StatusCodes.CREATED)
  create(@Body() createTrackDto: CreateTrackDto) {
    return this.trackService.create(createTrackDto);
  }

  @Get()
  findAll() {
    return this.trackService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const maybeTrack = await this.trackService.findOne(id);
    if (maybeTrack === null) {
      response.status(StatusCodes.NOT_FOUND);
      return;
    } else {
      return maybeTrack;
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTrackDto: UpdateTrackDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const maybeTrack = await this.trackService.update(id, updateTrackDto);

    if (maybeTrack === null) {
      response.status(StatusCodes.NOT_FOUND);
      return;
    } else {
      return maybeTrack;
    }
  }

  @Delete(':id')
  @HttpCode(StatusCodes.NO_CONTENT)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const maybeTrack = await this.trackService.remove(id);

    if (maybeTrack === null) {
      response.status(StatusCodes.NOT_FOUND);
      return;
    } else {
      return maybeTrack;
    }
  }
}
