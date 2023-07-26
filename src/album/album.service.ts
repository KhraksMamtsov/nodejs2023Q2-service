import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { DatabaseService } from '../database/database.service';
import { Album } from './entities/album.entity';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { TrackService } from '../track/track.service';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class AlbumService {
  constructor(
    readonly database: DatabaseService,

    @Inject(forwardRef(() => TrackService))
    readonly trackService: TrackService,

    @Inject(forwardRef(() => FavoritesService))
    readonly favoritesService: FavoritesService,
  ) {}

  async create(createAlbumDto: CreateAlbumDto) {
    const createdAlbum = await this.database.create<Album>(
      'album',
      createAlbumDto,
    );

    return new Album(createdAlbum);
  }

  async findOne(id: string) {
    const updatedAlbum = await this.database.findOne<Album>('album', id);

    if (updatedAlbum === null) {
      return null;
    } else {
      return new Album(updatedAlbum);
    }
  }

  async findAll() {
    const allAlbums = await this.database.findAll<Album>('album');
    return allAlbums.map((x) => new Album(x));
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const updatedAlbum = await this.database.update<Album>(
      'album',
      id,
      updateAlbumDto,
    );

    if (updatedAlbum === null) {
      return null;
    } else {
      return new Album(updatedAlbum);
    }
  }

  async remove(id: string) {
    const deletedAlbum = await this.database.delete<Album>('album', id);

    if (deletedAlbum === null) {
      return null;
    } else {
      await Promise.all([
        this.favoritesService.removeAlbum(deletedAlbum.id),
        this.trackService.clearAlbum(deletedAlbum.id),
      ]);
      return new Album(deletedAlbum);
    }
  }

  async clearArtist(artistId: string) {
    const albumsWithAuthor = await this.database.findWhere<Album>(
      'album',
      (x) => x.artistId === artistId,
    );

    return Promise.all(
      albumsWithAuthor.map((x) =>
        this.update(x.id, {
          artistId: null,
        }),
      ),
    );
  }
}
