import { describe, expect, it } from 'vitest';
import type { PlaceType } from './index.js';

// `satisfies Record<PlaceType, true>` fails to compile if a member is missing or an extra key exists,
// pinning the union to exactly these values.
const allPlaceTypes = {
  italian_restaurant: true,
  hamburger_restaurant: true,
  pizza_restaurant: true,
  sushi_restaurant: true,
  restaurant: true,
} satisfies Record<PlaceType, true>;

describe('PlaceType', () => {
  it('is exactly the five supported values', () => {
    expect(Object.keys(allPlaceTypes)).toHaveLength(5);
  });
});
