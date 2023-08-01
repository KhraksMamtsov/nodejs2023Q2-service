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
    const createdTrack = await this.database.create('track', createTrackDto);

    return new Track(createdTrack);
  }

  async findAll() {
    const allTracks = await this.database.findAll('track');
    return allTracks.map((x) => new Track(x));
  }

  async findOne(id: string) {
    const updatedTrack = await this.database.findOne('track', id);

    if (updatedTrack === null) {
      return null;
    } else {
      return new Track(updatedTrack);
    }
  }

  async findWithIds(ids: string[]) {
    const updatedTrack = await this.database.findWhere('track', {
      id: {
        in: ids,
      },
    });

    if (updatedTrack === null) {
      return null;
    } else {
      return updatedTrack.map((x) => new Track(x));
    }
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    const updatedTrack = await this.database.update(
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
    const deletedTrack = await this.database.delete('track', id);

    if (deletedTrack === null) {
      return null;
    } else {
      await this.favoritesService.removeTrack(deletedTrack.id);
      return new Track(deletedTrack);
    }
  }

  async clearArtist(artistId: string) {
    const tracksWithAuthor = await this.database.findWhere('track', {
      artistId,
    });

    return Promise.all(
      tracksWithAuthor.map((x) =>
        this.update(x.id, {
          artistId: null,
        }),
      ),
    );
  }

  async clearAlbum(albumId: string) {
    const tracksWithAlbum = await this.database.findWhere('track', { albumId });

    return Promise.all(
      tracksWithAlbum.map((x) =>
        this.update(x.id, {
          albumId: null,
        }),
      ),
    );
  }
}
