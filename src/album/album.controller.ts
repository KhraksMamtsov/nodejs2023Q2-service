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
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Album } from './entities/album.entity';

@ApiTags('Album')
@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @ApiOperation({
    summary: 'Get albums list',
    description: 'Gets all library albums list',
  })
  @ApiOkResponse({
    description: 'Successful operation',
    isArray: true,
    type: Album,
  })
  @Get()
  findAll() {
    return this.albumService.findAll();
  }

  @ApiOperation({
    summary: 'Add new album',
    description: 'Add new album information',
  })
  @ApiCreatedResponse({
    description: 'Album is created',
    type: Album,
  })
  @ApiBadRequestResponse({
    description: 'Body does not contain required fields',
  })
  @Post()
  @HttpCode(StatusCodes.CREATED)
  create(@Body() createAlbumDto: CreateAlbumDto) {
    return this.albumService.create(createAlbumDto);
  }

  @ApiOperation({
    summary: 'Get single album by id',
    description: 'Gets single album by id',
  })
  @ApiParam({ name: 'albumId', format: 'uuid' })
  @ApiBadRequestResponse({
    description: 'Album id is invalid (not uuid)',
  })
  @ApiOkResponse({
    description: 'Successful operation',
    type: Album,
  })
  @ApiNotFoundResponse({
    description: 'Album was not found',
  })
  @Get(':albumId')
  async findOne(
    @Param('albumId', ParseUUIDPipe)
    id: string,
  ) {
    const maybeAlbum = await this.albumService.findOne(id);
    if (maybeAlbum === null) {
      throw new NotFoundException(`There is no album with id ${id}`);
    } else {
      return maybeAlbum;
    }
  }

  @ApiOperation({
    summary: 'Update album information',
    description: 'Update library album information by UUID',
  })
  @ApiParam({ name: 'albumId', format: 'uuid' })
  @ApiOkResponse({
    description: 'The album has been updated',
    type: Album,
  })
  @ApiBadRequestResponse({
    description: 'Album id is invalid (not uuid)',
  })
  @ApiNotFoundResponse({
    description: 'Album was not found',
  })
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

  @ApiOperation({
    summary: 'Delete album',
    description: 'Delete album from library',
  })
  @ApiParam({ name: 'albumId', format: 'uuid' })
  @ApiNoContentResponse({
    description: 'Deleted successfully',
    type: Album,
  })
  @ApiBadRequestResponse({
    description: 'Album id is invalid (not uuid)',
  })
  @ApiNotFoundResponse({
    description: 'Album was not found',
  })
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
