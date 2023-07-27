import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  ParseUUIDPipe,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';

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
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const maybeTrack = await this.trackService.findOne(id);
    if (maybeTrack === null) {
      throw new NotFoundException(`There is no track with id ${id}`);
    } else {
      return maybeTrack;
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    const maybeTrack = await this.trackService.update(id, updateTrackDto);

    if (maybeTrack === null) {
      throw new NotFoundException(`There is no track with id ${id}`);
    } else {
      return maybeTrack;
    }
  }

  @Delete(':id')
  @HttpCode(StatusCodes.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const maybeTrack = await this.trackService.remove(id);

    if (maybeTrack === null) {
      throw new NotFoundException(`There is no track with id ${id}`);
    } else {
      return maybeTrack;
    }
  }
}
