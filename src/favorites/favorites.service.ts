import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { NIL } from 'uuid';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';
import { Favorite } from './entities/favorite.entity';

@Injectable()
export class FavoritesService {
  private static readonly COMMON_ID = NIL;
  constructor(
    private readonly database: DatabaseService,
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
    private readonly artistService: ArtistService,
  ) {}

  async get() {
    const maybeFavorites = await this.database.findOne<Favorite>(
      'favorites',
      FavoritesService.COMMON_ID,
    );
    if (maybeFavorites === null) {
      return this.database.create<Favorite>(
        'favorites',
        {
          albums: [],
          artists: [],
          tracks: [],
        },
        FavoritesService.COMMON_ID,
      );
    } else {
      return maybeFavorites;
    }
  }

  async addTrack(trackId: string) {
    const favorites = await this.get();

    if (favorites.tracks.some((x) => x.id === trackId)) {
      return favorites;
    }

    const track = await this.trackService.findOne(trackId);

    if (track === null) {
      return null;
    } else {
      favorites.tracks.push(track);
      return await this.database.update<Favorite>(
        'favorites',
        favorites.id,
        favorites,
      );
    }
  }

  async addArtist(artistId: string) {
    const favorites = await this.get();

    if (favorites.artists.some((x) => x.id === artistId)) {
      return favorites;
    }

    const artist = await this.artistService.findOne(artistId);

    if (artist === null) {
      return null;
    } else {
      favorites.artists.push(artist);
      return await this.database.update<Favorite>(
        'favorites',
        favorites.id,
        favorites,
      );
    }
  }

  async addAlbum(albumId: string) {
    const favorites = await this.get();

    if (favorites.albums.some((x) => x.id === albumId)) {
      return favorites;
    }

    const album = await this.albumService.findOne(albumId);

    if (album === null) {
      return null;
    } else {
      favorites.albums.push(album);
      return await this.database.update<Favorite>(
        'favorites',
        favorites.id,
        favorites,
      );
    }
  }

  async removeAlbum(albumId: string) {
    const favorites = await this.get();

    if (favorites.albums.some((x) => x.id === albumId)) {
      const { albums, ...rest } = favorites;
      return await this.database.update<Favorite>('favorites', favorites.id, {
        ...rest,
        albums: albums.filter((x) => x.id !== albumId),
      });
    } else {
      return favorites;
    }
  }
  async removeArtist(artistId: string) {
    const favorites = await this.get();

    if (favorites.artists.some((x) => x.id === artistId)) {
      const { artists, ...rest } = favorites;
      return await this.database.update<Favorite>('favorites', favorites.id, {
        ...rest,
        artists: artists.filter((x) => x.id !== artistId),
      });
    } else {
      return favorites;
    }
  }
  async removeTrack(trackId: string) {
    const favorites = await this.get();

    if (favorites.tracks.some((x) => x.id === trackId)) {
      const { tracks, ...rest } = favorites;
      return await this.database.update<Favorite>('favorites', favorites.id, {
        ...rest,
        tracks: tracks.filter((x) => x.id !== trackId),
      });
    } else {
      return favorites;
    }
  }
}
