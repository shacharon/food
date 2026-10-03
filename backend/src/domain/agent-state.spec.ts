import { describe, expect, it } from 'vitest';
import {
  AGENT_LIMITS,
  type NeedInputState,
  type RadiusSource,
  type SearchingState,
  type Slots,
} from './index.js';

const TIME = '2026-10-03T00:00:00.000Z';

describe('AgentState', () => {
  it('represents a valid searching state with GPS and default radius', () => {
    const slots: Slots = {
      cuisineOrDish: 'sushi',
      location: { mode: 'gps', coordinates: { lat: 32.08, lng: 34.78 } },
      anchor: { lat: 32.08, lng: 34.78 },
      radiusMeters: AGENT_LIMITS.defaultRadiusMeters,
      radiusSource: 'default',
      openNow: null,
    };
    const state: SearchingState = {
      status: 'searching',
      sessionId: 's1',
      step: 0,
      searchAttempts: 0,
      clarificationsAsked: 0,
      slots,
      trace: [],
      candidates: [],
    };

    expect(state.status).toBe('searching');
    expect(state.slots.location.mode).toBe('gps');
    expect(state.slots.radiusMeters).toBe(300);
    expect(state.slots.radiusSource).toBe('default');
    expect(state.step).toBe(0);
    expect(state.searchAttempts).toBe(0);
  });

  it('represents a valid need_input state for missing location', () => {
    const question = 'Where should I look for restaurants?';
    const state: NeedInputState = {
      status: 'need_input',
      sessionId: 's2',
      step: 1,
      searchAttempts: 0,
      clarificationsAsked: 1,
      slots: {
        cuisineOrDish: 'pizza',
        location: { mode: 'missing' },
        anchor: null,
        radiusMeters: AGENT_LIMITS.defaultRadiusMeters,
        radiusSource: 'default',
        openNow: null,
      },
      trace: [
        {
          type: 'clarification',
          step: 1,
          timestamp: TIME,
          payload: { missing: 'location', question },
        },
      ],
      missing: 'location',
      question,
      finishReason: 'missing_location',
    };

    expect(state.status).toBe('need_input');
    expect(state.slots.location.mode).toBe('missing');
    expect(state.question).toBe(question);
    expect(state.clarificationsAsked).toBe(1);
    expect('places' in state).toBe(false);
    expect('candidates' in state).toBe(false);
  });

  it('keeps the locked limits', () => {
    const source: RadiusSource = 'default';

    expect(AGENT_LIMITS.maxSteps).toBe(6);
    expect(AGENT_LIMITS.maxSearchAttempts).toBe(2);
    expect(AGENT_LIMITS.maxClarificationsPerTurn).toBe(1);
    expect(AGENT_LIMITS.defaultRadiusMeters).toBe(300);
    expect(AGENT_LIMITS.widenedRadiusMeters).toBe(800);
    expect(source).toBe('default');
  });
});
