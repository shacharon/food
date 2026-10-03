import type { Circle } from '../circle.js';
import type { PlaceType } from '../place-type.js';
import type { RawPlace } from './raw-place.js';
import type { Tool } from './tool.js';

/** Optional fields use absence, not null (outbound request convention). */
export interface GoogleTextSearchInput {
  readonly textQuery: string;
  /** Biases only; results outside the circle are expected. */
  readonly locationBias: Circle;
  readonly includedType?: PlaceType;
  readonly openNow?: boolean;
}

export interface GoogleTextSearchOutput {
  readonly candidates: readonly RawPlace[];
}

export interface GoogleTextSearchTool
  extends Tool<GoogleTextSearchInput, GoogleTextSearchOutput> {
  readonly name: 'google_text_search';
}
