import { Album, Artist, Track } from '@prisma/client';

export class Favorite {
  readonly id: string;
  readonly artists: ReadonlyArray<Artist>;
  readonly albums: ReadonlyArray<Album>;
  readonly tracks: ReadonlyArray<Track>;
}
