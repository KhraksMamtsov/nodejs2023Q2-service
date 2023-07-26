import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { DatabaseService } from '../database/database.service';
import { Album } from './entities/album.entity';
import { UpdateArtistDto } from '../artist/dto/update-artist.dto';

@Injectable()
export class AlbumService {
  constructor(readonly database: DatabaseService) {}

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

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    const updatedAlbum = await this.database.update<Album>(
      'album',
      id,
      updateArtistDto,
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
      return new Album(deletedAlbum);
    }
  }
}
