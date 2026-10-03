import { describe, expect, it } from 'vitest';
import type { AgentState } from '../agent-state.js';
import { AGENT_LIMITS } from '../limits.js';
import type { ActionKind } from './action-kind.js';
import { allowedActions } from './allowed-actions.js';
import {
  addressState,
  doneState,
  failedState,
  gpsState,
  missingState,
  needInputState,
  placeNameState,
} from './testing/state-factories.js';

const ANCHOR = { lat: 32.08, lng: 34.78 } as const;

const gpsNoAnchor = gpsState({ slots: { ...gpsState().slots, anchor: null } });
const placeNameWithAnchor = placeNameState({
  slots: { ...placeNameState().slots, anchor: ANCHOR },
});
const addressWithAnchor = addressState({
  slots: { ...addressState().slots, anchor: ANCHOR },
});

const belowMaxSteps = AGENT_LIMITS.maxSteps - 1;
const someSearchesDone = AGENT_LIMITS.maxSearchAttempts - 1;

// First match wins. Each row overrides only what its rule needs; the order is part of the contract.
describe('allowedActions - rule table (first match wins, ordered)', () => {
  it.each<[string, AgentState, readonly ActionKind[]]>([
    ['1: done -> []', doneState(), []],
    ['1: failed -> []', failedState(), []],
    ['1: need_input -> []', needInputState(), []],
    [
      '2: step === maxSteps -> FINISH only',
      gpsState({ step: AGENT_LIMITS.maxSteps }),
      ['FINISH'],
    ],
    [
      '2: step > maxSteps -> FINISH only',
      gpsState({ step: AGENT_LIMITS.maxSteps + 1 }),
      ['FINISH'],
    ],
    [
      '2: step >= maxSteps beats missing location with clarification unused',
      missingState({ step: AGENT_LIMITS.maxSteps, clarificationsAsked: 0 }),
      ['FINISH'],
    ],
    [
      '3: location missing, clarification unused -> ASK_CLARIFICATION only',
      missingState({ step: belowMaxSteps, clarificationsAsked: 0 }),
      ['ASK_CLARIFICATION'],
    ],
    [
      '4: location missing, clarification used -> FINISH only',
      missingState({ clarificationsAsked: AGENT_LIMITS.maxClarificationsPerTurn }),
      ['FINISH'],
    ],
    ['5: GPS without anchor -> FINISH only', gpsNoAnchor, ['FINISH']],
    ['6: place_name without anchor -> geocode_location only', placeNameState(), ['geocode_location']],
    ['6: address without anchor -> geocode_location only', addressState(), ['geocode_location']],
    [
      '7: anchor, attempts exhausted -> FINISH only',
      gpsState({ searchAttempts: AGENT_LIMITS.maxSearchAttempts }),
      ['FINISH'],
    ],
    [
      '8: GPS anchor, no search yet -> nearby, text',
      gpsState({ step: 0, searchAttempts: 0 }),
      ['google_nearby_search', 'google_text_search'],
    ],
    [
      '8: place_name with anchor, no search yet -> nearby, text',
      placeNameWithAnchor,
      ['google_nearby_search', 'google_text_search'],
    ],
    [
      '8: address with anchor, no search yet -> nearby, text',
      addressWithAnchor,
      ['google_nearby_search', 'google_text_search'],
    ],
    [
      '8: step === maxSteps - 1 does not match rule 2 -> nearby, text',
      gpsState({ step: belowMaxSteps, searchAttempts: 0 }),
      ['google_nearby_search', 'google_text_search'],
    ],
    [
      '9: anchor, some searches done, not exhausted -> nearby, text, FINISH',
      gpsState({ step: 1, searchAttempts: someSearchesDone }),
      ['google_nearby_search', 'google_text_search', 'FINISH'],
    ],
  ])('rule %s', (_name, state, expected) => {
    expect(allowedActions(state)).toEqual(expected);
  });

  // Sprint 2: needs a verified-results signal on SearchingState
  it.todo('verified places exist -> FINISH only');
});

describe('allowedActions - non-terminal invariant', () => {
  const stepValues = [0, belowMaxSteps, AGENT_LIMITS.maxSteps];
  const attemptCounts = [0, 1, AGENT_LIMITS.maxSearchAttempts];
  const clarificationCounts = [0, AGENT_LIMITS.maxClarificationsPerTurn];
  const nonTerminalStates: readonly (readonly [string, AgentState])[] = [
    gpsState,
    () => gpsNoAnchor,
    missingState,
    placeNameState,
    () => placeNameWithAnchor,
    addressState,
    () => addressWithAnchor,
  ].flatMap((make, index) =>
    stepValues.flatMap((step) =>
      attemptCounts.flatMap((searchAttempts) =>
        clarificationCounts.map((clarificationsAsked) => {
          const state = { ...make(), step, searchAttempts, clarificationsAsked };
          return [
            `variant ${index} step=${step} attempts=${searchAttempts} clarifications=${clarificationsAsked}`,
            state,
          ] as const;
        }),
      ),
    ),
  );

  it.each(nonTerminalStates)('%s -> at least one allowed action', (_name, state) => {
    expect(allowedActions(state).length).toBeGreaterThanOrEqual(1);
  });
});
