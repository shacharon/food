import type { Coordinates } from '../coordinates.js';
import type { RawPlace } from './raw-place.js';
import type { Tool } from './tool.js';

export interface GoogleNearbySearchInput {
  readonly anchor: Coordinates;
  readonly radiusMeters: number;
  /** Optional keyword, e.g. cuisine or dish. */
  readonly keyword: string | null;
  readonly openNow: boolean | null;
}

export interface GoogleNearbySearchOutput {
  readonly candidates: readonly RawPlace[];
}

export interface GoogleNearbySearchTool
  extends Tool<GoogleNearbySearchInput, GoogleNearbySearchOutput> {
  readonly name: 'google_nearby_search';
}
