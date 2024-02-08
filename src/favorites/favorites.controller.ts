import {
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { StatusCodes } from 'http-status-codes';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { FavoriteDto } from './dto/favorite.dto';

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
    type: FavoriteDto,
  })
  @Get()
  findAll() {
    return this.favoritesService.getFavorites();
  }

  @ApiOperation({
    description: 'Add track to the favorites',
    summary: 'Add track to the favorites',
  })
  @ApiParam({
    name: 'trackId',
    format: 'uuid',
  })
  @ApiCreatedResponse({
    description: 'Added successfully',
  })
  @ApiBadRequestResponse({
    description: 'Track id is invalid (not uuid)',
  })
  @ApiUnprocessableEntityResponse({
    description: "Track with id doesn't exist",
  })
  @Post('track/:trackId')
  @HttpCode(StatusCodes.CREATED)
  async addTrack(@Param('trackId', ParseUUIDPipe) id: string) {
    const maybeResult = await this.favoritesService.addTrack(id);

    if (maybeResult === null) {
      throw new UnprocessableEntityException(`There is no track with id ${id}`);
    }
    return `Track with id ${id} is added to favorites`;
  }

  @ApiOperation({
    summary: 'Delete track from favorites',
    description: 'Delete track from favorites',
  })
  @ApiParam({
    name: 'trackId',
    format: 'uuid',
  })
  @ApiNoContentResponse({
    description: 'Deleted successfully',
  })
  @ApiBadRequestResponse({
    description: 'Track id is invalid (not uuid)',
  })
  @ApiNotFoundResponse({
    description: 'Track was not found',
  })
  @Delete('track/:trackId')
  @HttpCode(StatusCodes.NO_CONTENT)
  async removeTrack(@Param('trackId', ParseUUIDPipe) id: string) {
    const deleteResult = await this.favoritesService.removeTrack(id);

    if (deleteResult === null) {
      throw new NotFoundException(`Track with id ${id} is not in favorites`);
    } else {
      return `Track with id ${id} is deleted from favorites`;
    }
  }

  @ApiOperation({
    description: 'Add artist to the favorites',
    summary: 'Add artist to the favorites',
  })
  @ApiParam({
    name: 'artistId',
    format: 'uuid',
  })
  @ApiCreatedResponse({
    description: 'Added successfully',
  })
  @ApiBadRequestResponse({
    description: 'Artist id is invalid (not uuid)',
  })
  @ApiUnprocessableEntityResponse({
    description: "Artist with id doesn't exist",
  })
  @Post('artist/:artistId')
  @HttpCode(StatusCodes.CREATED)
  async addArtist(@Param('artistId', ParseUUIDPipe) id: string) {
    const maybeResult = await this.favoritesService.addArtist(id);

    if (maybeResult === null) {
      throw new UnprocessableEntityException(
        `There is no artist with id ${id}`,
      );
    }
    return `Artist with id ${id} is added to favorites`;
  }

  @ApiOperation({
    summary: 'Delete artist from favorites',
    description: 'Delete artist from favorites',
  })
  @ApiParam({
    name: 'artistId',
    format: 'uuid',
  })
  @ApiNoContentResponse({
    description: 'Deleted successfully',
  })
  @ApiBadRequestResponse({
    description: 'Artist id is invalid (not uuid)',
  })
  @ApiNotFoundResponse({
    description: 'Artist was not found',
  })
  @ApiParam({
    name: 'artistId',
    format: 'uuid',
  })
  @Delete('artist/:artistId')
  @HttpCode(StatusCodes.NO_CONTENT)
  async removeArtist(@Param('artistId', ParseUUIDPipe) id: string) {
    const deleteResult = await this.favoritesService.removeArtist(id);

    if (deleteResult === null) {
      throw new NotFoundException(`Track with id ${id} is not in favorites`);
    } else {
      return `Artist with id ${id} is deleted from favorites`;
    }
  }

  @ApiOperation({
    description: 'Add album to the favorites',
    summary: 'Add album to the favorites',
  })
  @ApiParam({
    name: 'albumId',
    format: 'uuid',
  })
  @ApiCreatedResponse({
    description: 'Added successfully',
  })
  @ApiBadRequestResponse({
    description: 'Album id is invalid (not uuid)',
  })
  @ApiUnprocessableEntityResponse({
    description: "Album with id doesn't exist",
  })
  @Post('album/:albumId')
  @HttpCode(StatusCodes.CREATED)
  async addAlbum(@Param('albumId', ParseUUIDPipe) id: string) {
    const maybeResult = await this.favoritesService.addAlbum(id);

    if (maybeResult === null) {
      throw new UnprocessableEntityException(`There is no album with id ${id}`);
    }
    return `Album with id ${id} is added to favorites`;
  }

  @ApiOperation({
    summary: 'Delete album from favorites',
    description: 'Delete album from favorites',
  })
  @ApiParam({
    name: 'albumId',
    format: 'uuid',
  })
  @ApiNoContentResponse({
    description: 'Deleted successfully',
  })
  @ApiBadRequestResponse({
    description: 'Album id is invalid (not uuid)',
  })
  @ApiNotFoundResponse({
    description: 'Album was not found',
  })
  @Delete('album/:albumId')
  @HttpCode(StatusCodes.NO_CONTENT)
  async removeAlbum(@Param('albumId', ParseUUIDPipe) id: string) {
    const deleteResult = await this.favoritesService.removeAlbum(id);

    if (deleteResult === null) {
      throw new NotFoundException(`Track with id ${id} is not in favorites`);
    } else {
      return `Album with id ${id} is deleted from favorites`;
    }
  }
}
