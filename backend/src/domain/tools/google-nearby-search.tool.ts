import type { Circle } from '../circle.js';
import type { PlaceType } from '../place-type.js';
import type { RawPlace } from './raw-place.js';
import type { Tool } from './tool.js';

export interface GoogleNearbySearchInput {
  readonly includedTypes: readonly [PlaceType, ...PlaceType[]];
  readonly locationRestriction: Circle;
}

export interface GoogleNearbySearchOutput {
  readonly candidates: readonly RawPlace[];
}

export interface GoogleNearbySearchTool
  extends Tool<GoogleNearbySearchInput, GoogleNearbySearchOutput> {
  readonly name: 'google_nearby_search';
}
