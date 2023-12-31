import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { DatabaseService } from '../database/database.service';
import { Artist } from './entities/artist.entity';

@Injectable()
export class ArtistService {
  constructor(private readonly database: DatabaseService) {}
  async create(createArtistDto: CreateArtistDto) {
    const createdArtist = await this.database.create('artist', createArtistDto);

    return new Artist(createdArtist);
  }

  async findAll() {
    const allArtists = await this.database.findAll('artist');
    return allArtists.map((x) => new Artist(x));
  }

  async findWithIds(ids: string[]) {
    const updatedTrack = await this.database.findWhere('artist', {
      id: { in: ids },
    });

    if (updatedTrack === null) {
      return null;
    } else {
      return updatedTrack.map((x) => new Artist(x));
    }
  }

  async findOne(id: string) {
    const artist = await this.database.findOne('artist', id);

    if (artist === null) {
      return null;
    } else {
      return new Artist(artist);
    }
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    const updatedArtist = await this.database.update(
      'artist',
      id,
      updateArtistDto,
    );

    if (updatedArtist === null) {
      return null;
    } else {
      return new Artist(updatedArtist);
    }
  }

  async remove(id: string) {
    const deletedArtist = await this.database.delete('artist', id);

    if (deletedArtist === null) {
      return null;
    } else {
      return new Artist(deletedArtist);
    }
  }
}
