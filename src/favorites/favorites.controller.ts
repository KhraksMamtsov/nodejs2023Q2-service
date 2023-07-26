import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  ParseUUIDPipe,
  Res,
  HttpCode,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { StatusCodes } from 'http-status-codes';
import { Response } from 'express';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  findAll() {
    return this.favoritesService.get();
  }

  @Post('track/:id')
  async addTrack(
    @Param('id', ParseUUIDPipe) id: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const maybeResult = await this.favoritesService.addTrack(id);

    if (maybeResult === null) {
      response.status(StatusCodes.UNPROCESSABLE_ENTITY);
      return;
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
  async addArtist(
    @Param('id', ParseUUIDPipe) id: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const maybeResult = await this.favoritesService.addArtist(id);

    if (maybeResult === null) {
      response.status(StatusCodes.UNPROCESSABLE_ENTITY);
      return;
    }
    return maybeResult;
  }

  @Delete('artist/:id')
  @HttpCode(StatusCodes.NO_CONTENT)
  async removeArtist(@Param('id', ParseUUIDPipe) id: string) {
    const deleteResult = await this.favoritesService.removeArtist(id);
    return deleteResult;
  }

  @Post('album/:id')
  async addAlbum(
    @Param('id', ParseUUIDPipe) id: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const maybeResult = await this.favoritesService.addAlbum(id);

    if (maybeResult === null) {
      response.status(StatusCodes.UNPROCESSABLE_ENTITY);
      return;
    }
    return maybeResult;
  }

  @Delete('album/:id')
  @HttpCode(StatusCodes.NO_CONTENT)
  async removeAlbum(@Param('id', ParseUUIDPipe) id: string) {
    const deleteResult = await this.favoritesService.removeAlbum(id);
    return deleteResult;
  }
}
