import type {
  DoneState,
  FailedState,
  NeedInputState,
  SearchingState,
} from '../../agent-state.js';
import { AGENT_LIMITS } from '../../limits.js';
import type { Slots } from '../../slots.js';

const TEL_AVIV = { lat: 32.0853, lng: 34.7818 } as const;

const baseState = {
  sessionId: 'session-1',
  step: 0,
  searchAttempts: 0,
  clarificationsAsked: 0,
  trace: [],
} as const;

const baseSlots = {
  cuisineOrDish: 'hamburger',
  radiusMeters: AGENT_LIMITS.defaultRadiusMeters,
  radiusSource: 'default',
  openNow: true,
} as const;

/** Searching state with GPS and a resolved anchor. */
export function gpsState(overrides: Partial<SearchingState> = {}): SearchingState {
  const slots: Slots = {
    ...baseSlots,
    location: { mode: 'gps', coordinates: TEL_AVIV },
    anchor: TEL_AVIV,
  };
  return { ...baseState, status: 'searching', slots, candidates: [], ...overrides };
}

/** Searching state with no usable location yet. */
export function missingState(overrides: Partial<SearchingState> = {}): SearchingState {
  const slots: Slots = {
    ...baseSlots,
    location: { mode: 'missing' },
    anchor: null,
  };
  return { ...baseState, status: 'searching', slots, candidates: [], ...overrides };
}

/** Searching state with a place name and no anchor until geocoded. */
export function placeNameState(overrides: Partial<SearchingState> = {}): SearchingState {
  const slots: Slots = {
    ...baseSlots,
    location: { mode: 'place_name', placeName: 'Dizengoff Center' },
    anchor: null,
  };
  return { ...baseState, status: 'searching', slots, candidates: [], ...overrides };
}

/** Searching state with an address and no anchor until geocoded. */
export function addressState(overrides: Partial<SearchingState> = {}): SearchingState {
  const slots: Slots = {
    ...baseSlots,
    location: { mode: 'address', address: 'Dizengoff 10, Tel Aviv' },
    anchor: null,
  };
  return { ...baseState, status: 'searching', slots, candidates: [], ...overrides };
}

export function needInputState(overrides: Partial<NeedInputState> = {}): NeedInputState {
  return {
    ...missingState(),
    status: 'need_input',
    missing: 'location',
    question: 'Where should I look?',
    finishReason: 'missing_location',
    ...overrides,
  } as NeedInputState;
}

export function doneState(overrides: Partial<DoneState> = {}): DoneState {
  return {
    ...gpsState(),
    status: 'done',
    finishReason: 'verified',
    places: [],
    ...overrides,
  } as DoneState;
}

export function failedState(overrides: Partial<FailedState> = {}): FailedState {
  return {
    ...gpsState(),
    status: 'failed',
    finishReason: 'failed',
    error: { code: 'unknown', message: 'boom', soft: false },
    ...overrides,
  } as FailedState;
}
