export class Artist {
  readonly id: string; // uuid v4
  readonly name: string;
  readonly grammy: boolean;

  constructor(args: Artist) {
    Object.assign(this, args);
  }
}
