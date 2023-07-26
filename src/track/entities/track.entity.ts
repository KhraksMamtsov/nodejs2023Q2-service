export class Track {
  readonly id: string; // uuid v4
  readonly name: string;
  readonly artistId: string | null; // refers to Artist
  readonly albumId: string | null; // refers to Album
  readonly duration: number; // integer number

  constructor(args: Track) {
    Object.assign(this, args);
  }
}
