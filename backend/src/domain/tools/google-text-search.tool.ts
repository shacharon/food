import type { Coordinates } from '../coordinates.js';
import type { RawPlace } from './raw-place.js';
import type { Tool } from './tool.js';

export interface GoogleTextSearchInput {
  readonly query: string;
  readonly anchor: Coordinates;
  readonly radiusMeters: number;
  readonly openNow: boolean | null;
}

export interface GoogleTextSearchOutput {
  readonly candidates: readonly RawPlace[];
}

export interface GoogleTextSearchTool
  extends Tool<GoogleTextSearchInput, GoogleTextSearchOutput> {
  readonly name: 'google_text_search';
}
