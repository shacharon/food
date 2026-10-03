import type { Coordinates } from '../coordinates.js';

/** Unverified place as returned by a search provider. */
export interface RawPlace {
  readonly placeId: string;
  readonly name: string;
  readonly address: string | null;
  readonly coordinates: Coordinates;
  /** null when the provider does not report opening state. */
  readonly openNow: boolean | null;
  readonly types: readonly string[];
  readonly rating: number | null;
}
