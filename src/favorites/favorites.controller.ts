import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { StatusCodes } from 'http-status-codes';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Favorite } from './entities/favorite.entity';

@ApiTags('Favorites')
@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @ApiOperation({
    description: 'Gets all favorites movies, tracks and books',
    summary: 'Gets all favorites',
  })
  @ApiOkResponse({
    description: 'Successful operation',
    type: Favorite,
  })
  @Get()
  findAll() {
    return this.favoritesService.get();
  }

  @ApiParam({
    name: 'trackId',
    format: 'uuid',
  })
  @Post('track/:trackId')
  async addTrack(@Param('trackId', ParseUUIDPipe) id: string) {
    const maybeResult = await this.favoritesService.addTrack(id);

    if (maybeResult === null) {
      throw new UnprocessableEntityException(`There is no track with id ${id}`);
    }
    return maybeResult;
  }

  @ApiParam({
    name: 'trackId',
    format: 'uuid',
  })
  @Delete('track/:trackId')
  @HttpCode(StatusCodes.NO_CONTENT)
  async removeTrack(@Param('trackId', ParseUUIDPipe) id: string) {
    const deleteResult = await this.favoritesService.removeTrack(id);
    return deleteResult;
  }

  @ApiParam({
    name: 'artistId',
    format: 'uuid',
  })
  @Post('artist/:artistId')
  async addArtist(@Param('artistId', ParseUUIDPipe) id: string) {
    const maybeResult = await this.favoritesService.addArtist(id);

    if (maybeResult === null) {
      throw new UnprocessableEntityException(
        `There is no artist with id ${id}`,
      );
    }
    return maybeResult;
  }

  @ApiParam({
    name: 'artistId',
    format: 'uuid',
  })
  @Delete('artist/:artistId')
  @HttpCode(StatusCodes.NO_CONTENT)
  removeArtist(@Param('artistId', ParseUUIDPipe) id: string) {
    return this.favoritesService.removeArtist(id);
  }

  @ApiParam({
    name: 'albumId',
    format: 'uuid',
  })
  @Post('album/:albumId')
  async addAlbum(@Param('albumId', ParseUUIDPipe) id: string) {
    const maybeResult = await this.favoritesService.addAlbum(id);

    if (maybeResult === null) {
      throw new UnprocessableEntityException(`There is no album with id ${id}`);
    }
    return maybeResult;
  }

  @ApiParam({
    name: 'albumId',
    format: 'uuid',
  })
  @Delete('album/:albumId')
  @HttpCode(StatusCodes.NO_CONTENT)
  removeAlbum(@Param('albumId', ParseUUIDPipe) id: string) {
    return this.favoritesService.removeAlbum(id);
  }
}
