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
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Artist')
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

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const maybeArtist = await this.artistService.findOne(id);
    if (maybeArtist === null) {
      throw new NotFoundException(`There is no artist with id ${id}`);
    } else {
      return maybeArtist;
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    const maybeArtist = await this.artistService.update(id, updateArtistDto);

    if (maybeArtist === null) {
      throw new NotFoundException(`There is no artist with id ${id}`);
    } else {
      return maybeArtist;
    }
  }

  @Delete(':id')
  @HttpCode(StatusCodes.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const maybeArtist = await this.artistService.remove(id);

    if (maybeArtist === null) {
      throw new NotFoundException(`There is no artist with id ${id}`);
    } else {
      return maybeArtist;
    }
  }
}
