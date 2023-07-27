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
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Favorites')
@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  findAll() {
    return this.favoritesService.get();
  }

  @Post('track/:id')
  async addTrack(@Param('id', ParseUUIDPipe) id: string) {
    const maybeResult = await this.favoritesService.addTrack(id);

    if (maybeResult === null) {
      throw new UnprocessableEntityException(`There is no track with id ${id}`);
    }
    return maybeResult;
  }

  @Delete('track/:id')
  @HttpCode(StatusCodes.NO_CONTENT)
  async removeTrack(@Param('id', ParseUUIDPipe) id: string) {
    const deleteResult = await this.favoritesService.removeTrack(id);
    return deleteResult;
  }

  @Post('artist/:id')
  async addArtist(@Param('id', ParseUUIDPipe) id: string) {
    const maybeResult = await this.favoritesService.addArtist(id);

    if (maybeResult === null) {
      throw new UnprocessableEntityException(
        `There is no artist with id ${id}`,
      );
    }
    return maybeResult;
  }

  @Delete('artist/:id')
  @HttpCode(StatusCodes.NO_CONTENT)
  removeArtist(@Param('id', ParseUUIDPipe) id: string) {
    return this.favoritesService.removeArtist(id);
  }

  @Post('album/:id')
  async addAlbum(@Param('id', ParseUUIDPipe) id: string) {
    const maybeResult = await this.favoritesService.addAlbum(id);

    if (maybeResult === null) {
      throw new UnprocessableEntityException(`There is no album with id ${id}`);
    }
    return maybeResult;
  }

  @Delete('album/:id')
  @HttpCode(StatusCodes.NO_CONTENT)
  removeAlbum(@Param('id', ParseUUIDPipe) id: string) {
    return this.favoritesService.removeAlbum(id);
  }
}
