export class Ring {
  name: string;
  popularityScore: number;
  weight: number;
  images: {
    yellow: string;
    rose: string;
    white: string;
  };

  constructor(partial: Partial<Ring>) {
    Object.assign(this, partial);
  }
}
