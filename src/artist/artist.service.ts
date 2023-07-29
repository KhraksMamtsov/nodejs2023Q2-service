import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { DatabaseService } from '../database/database.service';
import { Artist } from './entities/artist.entity';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class ArtistService {
  constructor(
    private readonly database: DatabaseService,

    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,

    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,

    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}
  async create(createArtistDto: CreateArtistDto) {
    const createdArtist = await this.database.create<Artist>(
      'artist',
      createArtistDto,
    );

    return new Artist(createdArtist);
  }

  async findAll() {
    const allArtists = await this.database.findAll<Artist>('artist');
    return allArtists.map((x) => new Artist(x));
  }

  async findWithIds(ids: string[]) {
    const updatedTrack = await this.database.findWhere<Artist>('artist', (x) =>
      ids.includes(x.id),
    );

    if (updatedTrack === null) {
      return null;
    } else {
      return updatedTrack.map((x) => new Artist(x));
    }
  }

  async findOne(id: string) {
    const updatedArtist = await this.database.findOne<Artist>('artist', id);

    if (updatedArtist === null) {
      return null;
    } else {
      return new Artist(updatedArtist);
    }
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    const updatedArtist = await this.database.update<Artist>(
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
    const deletedArtist = await this.database.delete<Artist>('artist', id);

    if (deletedArtist === null) {
      return null;
    } else {
      await Promise.all([
        this.favoritesService.removeArtist(deletedArtist.id),
        this.trackService.clearArtist(deletedArtist.id),
        this.albumService.clearArtist(deletedArtist.id),
      ]);

      return new Artist(deletedArtist);
    }
  }
}
