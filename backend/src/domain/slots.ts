import type { Coordinates } from './coordinates.js';

export type RadiusSource = 'default' | 'explicit';

export interface GpsLocation {
  readonly mode: 'gps';
  readonly coordinates: Coordinates;
}

export interface PlaceNameLocation {
  readonly mode: 'place_name';
  readonly placeName: string;
}

export interface AddressLocation {
  readonly mode: 'address';
  readonly address: string;
}

export interface MissingLocation {
  readonly mode: 'missing';
}

export type LocationSlot =
  | GpsLocation
  | PlaceNameLocation
  | AddressLocation
  | MissingLocation;

export interface Slots {
  /** Cuisine type or specific dish, e.g. "sushi" or "carbonara". */
  readonly cuisineOrDish: string | null;
  readonly location: LocationSlot;
  /** Resolved search anchor; null until GPS is given or geocoding succeeds. */
  readonly anchor: Coordinates | null;
  readonly radiusMeters: number;
  readonly radiusSource: RadiusSource;
  readonly openNow: boolean | null;
}
