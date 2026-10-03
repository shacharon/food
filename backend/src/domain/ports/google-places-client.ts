import type {
  GeocodeLocationInput,
  GeocodeLocationOutput,
} from '../tools/geocode-location.tool.js';
import type {
  GoogleNearbySearchInput,
  GoogleNearbySearchOutput,
} from '../tools/google-nearby-search.tool.js';
import type {
  GoogleTextSearchInput,
  GoogleTextSearchOutput,
} from '../tools/google-text-search.tool.js';

/** Server-side gateway to Google. The API key never leaves the backend. */
export interface GooglePlacesClient {
  geocode(input: GeocodeLocationInput): Promise<GeocodeLocationOutput>;
  textSearch(input: GoogleTextSearchInput): Promise<GoogleTextSearchOutput>;
  nearbySearch(input: GoogleNearbySearchInput): Promise<GoogleNearbySearchOutput>;
}
