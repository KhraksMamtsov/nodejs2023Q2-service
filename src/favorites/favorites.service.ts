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
    const maybeFavorites = await this.database.findOne<Favorite>(
      'favorites',
      FavoritesService.COMMON_ID,
    );
    if (maybeFavorites === null) {
      return this.database.create<Favorite>(
        'favorites',
        {
          albumsIds: [],
          artistsIds: [],
          tracksIds: [],
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
      this.trackService.findWithIds(favorite.tracksIds),
      this.albumService.findWithIds(favorite.albumsIds),
      this.artistService.findWithIds(favorite.artistsIds),
    ]);

    return new FavoriteDto({
      albums,
      artists,
      tracks,
    });
  }

  async addTrack(trackId: string) {
    const favorite = await this.getEntity();

    if (favorite.tracksIds.includes(trackId)) {
      return this.build(favorite);
    }

    const track = await this.trackService.findOne(trackId);

    if (track === null) {
      return null;
    } else {
      favorite.tracksIds.push(track.id);
      const updatedFavorites = await this.database.update<Favorite>(
        'favorites',
        favorite.id,
        favorite,
      );

      return this.build(updatedFavorites);
    }
  }

  async addArtist(artistId: string) {
    const favorite = await this.getEntity();

    if (favorite.artistsIds.includes(artistId)) {
      return this.build(favorite);
    }

    const artist = await this.artistService.findOne(artistId);

    if (artist === null) {
      return null;
    } else {
      favorite.artistsIds.push(artist.id);
      const updatedFavorite = await this.database.update<Favorite>(
        'favorites',
        favorite.id,
        favorite,
      );
      return this.build(updatedFavorite);
    }
  }

  async addAlbum(albumId: string) {
    const favorite = await this.getEntity();

    if (favorite.albumsIds.includes(albumId)) {
      return this.build(favorite);
    }

    const album = await this.albumService.findOne(albumId);

    if (album === null) {
      return null;
    } else {
      favorite.albumsIds.push(album.id);
      const updatedFavorite = await this.database.update<Favorite>(
        'favorites',
        favorite.id,
        favorite,
      );
      return this.build(updatedFavorite);
    }
  }

  async removeAlbum(albumId: string) {
    const favorites = await this.getEntity();

    if (favorites.albumsIds.includes(albumId)) {
      const { albumsIds, ...rest } = favorites;
      const updatedFavorite = await this.database.update<Favorite>(
        'favorites',
        favorites.id,
        {
          ...rest,
          albumsIds: albumsIds.filter((id) => id !== albumId),
        },
      );
      return this.build(updatedFavorite);
    } else {
      return null;
    }
  }
  async removeArtist(artistId: string) {
    const favorite = await this.getEntity();

    if (favorite.artistsIds.includes(artistId)) {
      const { artistsIds, ...rest } = favorite;
      const updatedFavorite = await this.database.update<Favorite>(
        'favorites',
        favorite.id,
        {
          ...rest,
          artistsIds: artistsIds.filter((id) => id !== artistId),
        },
      );
      return this.build(updatedFavorite);
    } else {
      return null;
    }
  }
  async removeTrack(trackId: string) {
    const favorite = await this.getEntity();

    if (favorite.tracksIds.includes(trackId)) {
      const { tracksIds, ...rest } = favorite;
      const updatedFavorite = await this.database.update<Favorite>(
        'favorites',
        favorite.id,
        {
          ...rest,
          tracksIds: tracksIds.filter((id) => id !== trackId),
        },
      );
      return this.build(updatedFavorite);
    } else {
      return null;
    }
  }
}
