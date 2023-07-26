import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { DatabaseService } from '../database/database.service';
import { Track } from './entities/track.entity';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class TrackService {
  constructor(
    private readonly database: DatabaseService,

    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}
  async create(createTrackDto: CreateTrackDto) {
    const createdTrack = await this.database.create<Track>(
      'track',
      createTrackDto,
    );

    return new Track(createdTrack);
  }

  async findAll() {
    const allTracks = await this.database.findAll<Track>('track');
    return allTracks.map((x) => new Track(x));
  }

  async findOne(id: string) {
    const updatedTrack = await this.database.findOne<Track>('track', id);

    if (updatedTrack === null) {
      return null;
    } else {
      return new Track(updatedTrack);
    }
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    const updatedTrack = await this.database.update<Track>(
      'track',
      id,
      updateTrackDto,
    );

    if (updatedTrack === null) {
      return null;
    } else {
      return new Track(updatedTrack);
    }
  }

  async remove(id: string) {
    const deletedTrack = await this.database.delete<Track>('track', id);

    if (deletedTrack === null) {
      return null;
    } else {
      await this.favoritesService.removeTrack(deletedTrack.id);
      return new Track(deletedTrack);
    }
  }

  async clearArtist(artistId: string) {
    const tracksWithAuthor = await this.database.findWhere<Track>(
      'track',
      (x) => x.artistId === artistId,
    );

    return Promise.all(
      tracksWithAuthor.map((x) =>
        this.update(x.id, {
          artistId: null,
        }),
      ),
    );
  }

  async clearAlbum(albumId: string) {
    const tracksWithAlbum = await this.database.findWhere<Track>(
      'track',
      (x) => x.albumId === albumId,
    );

    return Promise.all(
      tracksWithAlbum.map((x) =>
        this.update(x.id, {
          albumId: null,
        }),
      ),
    );
  }
}
