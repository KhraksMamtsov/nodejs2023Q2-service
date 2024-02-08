import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { DatabaseService } from '../database/database.service';
import { Album } from './entities/album.entity';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumService {
  constructor(readonly database: DatabaseService) {}

  async create(createAlbumDto: CreateAlbumDto) {
    const createdAlbum = await this.database.create('album', createAlbumDto);

    return new Album(createdAlbum);
  }

  async findOne(id: string) {
    const updatedAlbum = await this.database.findOne('album', id);

    if (updatedAlbum === null) {
      return null;
    } else {
      return new Album(updatedAlbum);
    }
  }

  async findAll() {
    const allAlbums = await this.database.findAll('album');
    return allAlbums.map((x) => new Album(x));
  }

  async findWithIds(ids: string[]) {
    const updatedTrack = await this.database.findWhere('album', {
      id: { in: ids },
    });

    if (updatedTrack === null) {
      return null;
    } else {
      return updatedTrack.map((x) => new Album(x));
    }
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const updatedAlbum = await this.database.update(
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
    const deletedAlbum = await this.database.delete('album', id);

    if (deletedAlbum === null) {
      return null;
    } else {
      return new Album(deletedAlbum);
    }
  }

  async clearArtist(artistId: string) {
    const albumsWithAuthor = await this.database.findWhere('album', {
      artistId,
    });

    return Promise.all(
      albumsWithAuthor.map((x) =>
        this.update(x.id, {
          artistId: null,
        }),
      ),
    );
  }
}
