import { describe, expect, it } from 'vitest';
import type { GoogleTextSearchInput } from './google-text-search.tool.js';

const circle = { center: { lat: 32.08, lng: 34.78 }, radiusMeters: 1500 } as const;

describe('GoogleTextSearchInput', () => {
  it('accepts the minimal input', () => {
    const input: GoogleTextSearchInput = { textQuery: 'carbonara', locationBias: circle };

    expect(input.textQuery).toBe('carbonara');
  });

  it('accepts the full input', () => {
    const input: GoogleTextSearchInput = {
      textQuery: 'pizza',
      locationBias: circle,
      includedType: 'pizza_restaurant',
      openNow: true,
    };

    expect(input.openNow).toBe(true);
  });

  it('rejects inputs Google Text Search (New) cannot take', () => {
    // @ts-expect-error locationBias is required.
    const missingBias: GoogleTextSearchInput = { textQuery: 'pizza' };
    const oldQuery: GoogleTextSearchInput = {
      textQuery: 'pizza',
      locationBias: circle,
      // @ts-expect-error query was renamed to textQuery; it is an excess property.
      query: 'pizza',
    };
    // @ts-expect-error textQuery is required.
    const missingTextQuery: GoogleTextSearchInput = { locationBias: circle };
    const restriction: GoogleTextSearchInput = {
      textQuery: 'pizza',
      locationBias: circle,
      // @ts-expect-error locationRestriction belongs to nearby search; text search only biases.
      locationRestriction: circle,
    };
    const bogusType: GoogleTextSearchInput = {
      textQuery: 'pizza',
      locationBias: circle,
      // @ts-expect-error steak_house is not in the PlaceType union.
      includedType: 'steak_house',
    };
    const pluralTypes: GoogleTextSearchInput = {
      textQuery: 'pizza',
      locationBias: circle,
      // @ts-expect-error text search takes a single includedType, not includedTypes.
      includedTypes: ['pizza_restaurant'],
    };
    const nullOpenNow: GoogleTextSearchInput = {
      textQuery: 'pizza',
      locationBias: circle,
      // @ts-expect-error optional request fields use absence, not null.
      openNow: null,
    };

    expect([missingBias, oldQuery, missingTextQuery, restriction, bogusType, pluralTypes, nullOpenNow]).toHaveLength(7);
  });
});
