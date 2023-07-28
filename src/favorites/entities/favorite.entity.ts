import { Artist } from '../../artist/entities/artist.entity';
import { Album } from '../../album/entities/album.entity';
import { Track } from '../../track/entities/track.entity';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class Favorite {
  @Exclude()
  readonly id: string;

  @ApiProperty({
    isArray: true,
    type: Artist,
  })
  readonly artists: Array<Artist>;

  @ApiProperty({
    isArray: true,
    type: Album,
  })
  readonly albums: Array<Album>;

  @ApiProperty({
    isArray: true,
    type: Track,
  })
  readonly tracks: Array<Track>;
}
