import type { Coordinates } from './coordinates.js';

export interface Circle {
  readonly center: Coordinates;
  readonly radiusMeters: number;
}
