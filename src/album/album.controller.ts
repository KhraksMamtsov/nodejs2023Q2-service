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
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Album')
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
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const maybeAlbum = await this.albumService.findOne(id);
    if (maybeAlbum === null) {
      throw new NotFoundException(`There is no album with id ${id}`);
    } else {
      return maybeAlbum;
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    const maybeAlbum = await this.albumService.update(id, updateAlbumDto);

    if (maybeAlbum === null) {
      throw new NotFoundException(`There is no album with id ${id}`);
    } else {
      return maybeAlbum;
    }
  }

  @Delete(':id')
  @HttpCode(StatusCodes.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const maybeAlbum = await this.albumService.remove(id);

    if (maybeAlbum === null) {
      throw new NotFoundException(`There is no album with id ${id}`);
    } else {
      return maybeAlbum;
    }
  }
}
