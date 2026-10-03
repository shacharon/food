import type { Coordinates } from './coordinates.js';

/** A place that passed filter_and_verify. Only these may appear in a reply. */
export interface VerifiedPlace {
  readonly placeId: string;
  readonly name: string;
  readonly address: string | null;
  readonly coordinates: Coordinates;
  readonly distanceMeters: number;
  readonly openNow: boolean | null;
  readonly rating: number | null;
}
