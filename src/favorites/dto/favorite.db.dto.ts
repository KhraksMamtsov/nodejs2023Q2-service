import { Album, Artist, Track } from '@prisma/client';

export class FavoriteDbDto {
  readonly id: string;
  readonly artists: ReadonlyArray<{ readonly artist: Artist }>;
  readonly albums: ReadonlyArray<{ readonly album: Album }>;
  readonly tracks: ReadonlyArray<{ readonly track: Track }>;
}
