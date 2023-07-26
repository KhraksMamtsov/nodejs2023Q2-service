export class Album {
  readonly id: string; // uuid v4
  readonly name: string;
  readonly year: number;
  readonly artistId: string | null; // refers to Artist

  constructor(args: Album) {
    Object.assign(this, args);
  }
}
