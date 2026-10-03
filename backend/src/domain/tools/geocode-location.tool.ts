import type { Coordinates } from '../coordinates.js';
import type { Tool } from './tool.js';

export interface GeocodeLocationInput {
  /** Named place or street address. */
  readonly query: string;
}

export interface GeocodeLocationOutput {
  readonly coordinates: Coordinates;
  readonly formattedAddress: string;
}

export interface GeocodeLocationTool
  extends Tool<GeocodeLocationInput, GeocodeLocationOutput> {
  readonly name: 'geocode_location';
}
