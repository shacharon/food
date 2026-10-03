import { describe, expect, it } from 'vitest';
import type { GoogleNearbySearchInput } from './google-nearby-search.tool.js';

const circle = { center: { lat: 32.08, lng: 34.78 }, radiusMeters: 1500 } as const;

describe('GoogleNearbySearchInput', () => {
  it('accepts included types with a location restriction circle', () => {
    const input: GoogleNearbySearchInput = {
      includedTypes: ['italian_restaurant'],
      locationRestriction: circle,
    };

    expect(input.includedTypes).toHaveLength(1);
  });

  it('rejects inputs Google Nearby Search (New) cannot take', () => {
    const removedKeyword: GoogleNearbySearchInput = {
      includedTypes: ['italian_restaurant'],
      locationRestriction: circle,
      // @ts-expect-error keyword was removed; nearby search takes no text.
      keyword: 'carbonara',
    };
    const removedOpenNow: GoogleNearbySearchInput = {
      includedTypes: ['italian_restaurant'],
      locationRestriction: circle,
      // @ts-expect-error openNow was removed; the verifier checks it.
      openNow: true,
    };
    const unknownType: GoogleNearbySearchInput = {
      locationRestriction: circle,
      // @ts-expect-error steak_house is not in the PlaceType union.
      includedTypes: ['steak_house'],
    };
    const removedType: GoogleNearbySearchInput = {
      locationRestriction: circle,
      // @ts-expect-error fast_food_restaurant is not a supported PlaceType.
      includedTypes: ['fast_food_restaurant'],
    };
    const emptyTypes: GoogleNearbySearchInput = {
      locationRestriction: circle,
      // @ts-expect-error includedTypes must be a non-empty tuple.
      includedTypes: [],
    };
    // @ts-expect-error locationRestriction is required.
    const missingArea: GoogleNearbySearchInput = { includedTypes: ['italian_restaurant'] };
    const textQuery: GoogleNearbySearchInput = {
      includedTypes: ['italian_restaurant'],
      locationRestriction: circle,
      // @ts-expect-error textQuery belongs to text search only.
      textQuery: 'pizza',
    };

    expect([
      removedKeyword,
      removedOpenNow,
      unknownType,
      removedType,
      emptyTypes,
      missingArea,
      textQuery,
    ]).toHaveLength(7);
  });
});
