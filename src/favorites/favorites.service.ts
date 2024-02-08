import { Injectable, OnModuleInit } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { NIL } from 'uuid';
import { FavoriteDto } from './dto/favorite.dto';
import { FavoriteDbDto } from './dto/favorite.db.dto';
import { Album } from '../album/entities/album.entity';
import { Track } from '../track/entities/track.entity';
import { Artist } from '../artist/entities/artist.entity';

@Injectable()
export class FavoritesService implements OnModuleInit {
  private static readonly COMMON_ID = NIL;
  constructor(private readonly database: DatabaseService) {}

  async onModuleInit() {
    await this.database.prismaClient.favorites.upsert({
      ...FavoritesService.COMMON_QUERY,
      create: { id: FavoritesService.COMMON_ID },
      update: {},
    });
  }

  public static COMMON_QUERY = {
    where: { id: FavoritesService.COMMON_ID },
    include: {
      albums: { include: { album: true } },
      tracks: { include: { track: true } },
      artists: { include: { artist: true } },
    },
  };

  private static dbDtoToApiDto(dbDto: FavoriteDbDto): FavoriteDto {
    return new FavoriteDto({
      albums: dbDto.albums.map((x) => new Album(x.album)),
      tracks: dbDto.tracks.map((x) => new Track(x.track)),
      artists: dbDto.artists.map((x) => new Artist(x.artist)),
    });
  }

  async getFavorites(): Promise<FavoriteDto> {
    const favorites = await this.database.prismaClient.favorites.findUnique({
      ...FavoritesService.COMMON_QUERY,
    });

    return FavoritesService.dbDtoToApiDto(favorites);
  }

  async addTrack(trackId: string) {
    try {
      await this.database.prismaClient.tracksOnFavorites.create({
        data: {
          track: { connect: { id: trackId } },
          favorites: { connect: { id: FavoritesService.COMMON_ID } },
        },
      });
    } catch {
      return null;
    }

    return this.getFavorites();
  }

  async addArtist(artistId: string) {
    try {
      await this.database.prismaClient.artistsOnFavorites.create({
        data: {
          artist: { connect: { id: artistId } },
          favorites: { connect: { id: FavoritesService.COMMON_ID } },
        },
      });
    } catch {
      return null;
    }

    return this.getFavorites();
  }

  async addAlbum(albumId: string) {
    try {
      await this.database.prismaClient.albumsOnFavorites.create({
        data: {
          album: { connect: { id: albumId } },
          favorites: { connect: { id: FavoritesService.COMMON_ID } },
        },
      });
    } catch {
      return null;
    }

    return this.getFavorites();
  }

  async removeAlbum(albumId: string) {
    const updatedFavorites = await this.database.prismaClient.favorites.update({
      ...FavoritesService.COMMON_QUERY,
      data: {
        albums: {
          delete: {
            albumId_favoritesId: {
              albumId,
              favoritesId: FavoritesService.COMMON_ID,
            },
          },
        },
      },
    });

    return FavoritesService.dbDtoToApiDto(updatedFavorites);
  }
  async removeArtist(artistId: string) {
    const updatedFavorites = await this.database.prismaClient.favorites.update({
      ...FavoritesService.COMMON_QUERY,
      data: {
        artists: {
          delete: {
            artistId_favoritesId: {
              artistId,
              favoritesId: FavoritesService.COMMON_ID,
            },
          },
        },
      },
    });

    return FavoritesService.dbDtoToApiDto(updatedFavorites);
  }
  async removeTrack(trackId: string) {
    const updatedFavorites = await this.database.prismaClient.favorites.update({
      ...FavoritesService.COMMON_QUERY,
      data: {
        tracks: {
          delete: {
            trackId_favoritesId: {
              trackId,
              favoritesId: FavoritesService.COMMON_ID,
            },
          },
        },
      },
    });

    return FavoritesService.dbDtoToApiDto(updatedFavorites);
  }
}
