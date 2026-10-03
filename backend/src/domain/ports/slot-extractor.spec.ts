import { describe, expect, it } from 'vitest';
import type { AgentSession, Coordinates, SlotExtractor, Slots } from '../index.js';

const slots: Slots = {
  cuisineOrDish: 'sushi',
  location: { mode: 'missing' },
  anchor: null,
  radiusMeters: 1500,
  radiusSource: 'default',
  openNow: null,
};

const gps: Coordinates = { lat: 32.08, lng: 34.78 };

// Trivial fake: only proves the port shape compiles.
class FixedSlotExtractor implements SlotExtractor {
  async extractSlots(
    _message: string,
    _gps: Coordinates | null,
    _previousSlots: Slots | null,
  ): Promise<Slots> {
    return slots;
  }
}

describe('SlotExtractor', () => {
  it('accepts (string, Coordinates | null, Slots | null) and returns Slots', async () => {
    const extractor: SlotExtractor = new FixedSlotExtractor();

    await expect(extractor.extractSlots('sushi', null, null)).resolves.toEqual(slots);
    await expect(extractor.extractSlots('sushi', gps, slots)).resolves.toEqual(slots);
  });

  it('requires previousSlots', () => {
    const extractor: SlotExtractor = new FixedSlotExtractor();

    // @ts-expect-error previousSlots is required (pass null on the first turn).
    const promise = extractor.extractSlots('sushi', null);

    expect(promise).toBeInstanceOf(Promise);
  });

  it('does not accept an AgentSession as the first argument', () => {
    const extractor: SlotExtractor = new FixedSlotExtractor();
    const session: AgentSession = { id: 's1', turn: 1, userMessage: 'sushi', gps: null };

    // @ts-expect-error the first argument is the message string, not a session.
    const promise = extractor.extractSlots(session, null, null);

    expect(promise).toBeInstanceOf(Promise);
  });

  it('rejects a Slots-shaped result missing radiusSource', () => {
    class BadExtractor implements SlotExtractor {
      async extractSlots(
        _message: string,
        _gps: Coordinates | null,
        _previousSlots: Slots | null,
      ): Promise<Slots> {
        // @ts-expect-error radiusSource is required on Slots.
        return {
          cuisineOrDish: null,
          location: { mode: 'missing' },
          anchor: null,
          radiusMeters: 1500,
          openNow: null,
        };
      }
    }

    expect(BadExtractor).toBeDefined();
  });
});
