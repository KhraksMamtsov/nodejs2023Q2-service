import type { Artist } from '../../artist/entities/artist.entity';
import type { Album } from '../../album/entities/album.entity';
import type { Track } from '../../track/entities/track.entity';

export class Favorite {
  readonly id: string;
  readonly artists: Array<Artist>;
  readonly albums: Array<Album>;
  readonly tracks: Array<Track>;
}
