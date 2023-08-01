import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { NIL } from 'uuid';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';
import { Favorite } from './entities/favorite.entity';
import { FavoriteDto } from './dto/favorite.dto';

@Injectable()
export class FavoritesService {
  private static readonly COMMON_ID = NIL;
  constructor(
    private readonly database: DatabaseService,

    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,

    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,

    @Inject(forwardRef(() => ArtistService))
    private readonly artistService: ArtistService,
  ) {}

  private async getEntity() {
    const maybeFavorites = await this.database.findOne(
      'favorites',
      FavoritesService.COMMON_ID,
    );
    if (maybeFavorites === null) {
      return this.database.create(
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

  async getDto() {
    const favorite = await this.getEntity();

    return this.build(favorite);
  }

  private async build(favorite: Favorite) {
    const [tracks, albums, artists] = await Promise.all([
      this.trackService.findWithIds(favorite.tracks),
      this.albumService.findWithIds(favorite.albums),
      this.artistService.findWithIds(favorite.artists),
    ]);

    return new FavoriteDto({
      albums,
      artists,
      tracks,
    });
  }

  async addTrack(trackId: string) {
    const favorite = await this.getEntity();

    if (favorite.tracks.includes(trackId)) {
      return this.build(favorite);
    }

    const track = await this.trackService.findOne(trackId);

    if (track === null) {
      return null;
    } else {
      favorite.tracks.push(track.id);
      const updatedFavorites = await this.database.update(
        'favorites',
        favorite.id,
        favorite,
      );

      return this.build(updatedFavorites);
    }
  }

  async addArtist(artistId: string) {
    const favorite = await this.getEntity();

    if (favorite.artists.includes(artistId)) {
      return this.build(favorite);
    }

    const artist = await this.artistService.findOne(artistId);

    if (artist === null) {
      return null;
    } else {
      favorite.artists.push(artist.id);
      const updatedFavorite = await this.database.update(
        'favorites',
        favorite.id,
        favorite,
      );
      return this.build(updatedFavorite);
    }
  }

  async addAlbum(albumId: string) {
    const favorite = await this.getEntity();

    if (favorite.albums.includes(albumId)) {
      return this.build(favorite);
    }

    const album = await this.albumService.findOne(albumId);

    if (album === null) {
      return null;
    } else {
      favorite.albums.push(album.id);
      const updatedFavorite = await this.database.update(
        'favorites',
        favorite.id,
        favorite,
      );
      return this.build(updatedFavorite);
    }
  }

  async removeAlbum(albumId: string) {
    const favorites = await this.getEntity();

    if (favorites.albums.includes(albumId)) {
      const { albums, ...rest } = favorites;
      const updatedFavorite = await this.database.update(
        'favorites',
        favorites.id,
        {
          ...rest,
          albums: albums.filter((id) => id !== albumId),
        },
      );
      return this.build(updatedFavorite);
    } else {
      return null;
    }
  }
  async removeArtist(artistId: string) {
    const favorite = await this.getEntity();

    if (favorite.artists.includes(artistId)) {
      const { artists, ...rest } = favorite;
      const updatedFavorite = await this.database.update(
        'favorites',
        favorite.id,
        {
          ...rest,
          artists: artists.filter((id) => id !== artistId),
        },
      );
      return this.build(updatedFavorite);
    } else {
      return null;
    }
  }
  async removeTrack(trackId: string) {
    const favorite = await this.getEntity();

    if (favorite.tracks.includes(trackId)) {
      const { tracks, ...rest } = favorite;
      const updatedFavorite = await this.database.update(
        'favorites',
        favorite.id,
        {
          ...rest,
          tracks: tracks.filter((id) => id !== trackId),
        },
      );
      return this.build(updatedFavorite);
    } else {
      return null;
    }
  }
}
