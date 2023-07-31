import { Artist } from '../../artist/entities/artist.entity';
import { Album } from '../../album/entities/album.entity';
import { Track } from '../../track/entities/track.entity';
import { ApiProperty } from '@nestjs/swagger';

export class FavoriteDto {
  @ApiProperty({
    isArray: true,
    type: Artist,
  })
  readonly artists: ReadonlyArray<Artist>;

  @ApiProperty({
    isArray: true,
    type: Album,
  })
  readonly albums: ReadonlyArray<Album>;

  @ApiProperty({
    isArray: true,
    type: Track,
  })
  readonly tracks: ReadonlyArray<Track>;

  constructor(args: FavoriteDto) {
    Object.assign(this, args);
  }
}
