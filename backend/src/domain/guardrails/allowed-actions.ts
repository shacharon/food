import { AGENT_LIMITS } from '../limits.js';
import type { AgentState } from '../agent-state.js';
import type { ActionKind } from './action-kind.js';

export function allowedActions(state: AgentState): readonly ActionKind[] {
  // Rule 1: terminal states allow nothing
  if (state.status !== 'searching') {
    return [];
  }

  // Rule 2: max steps reached -> FINISH only
  if (state.step >= AGENT_LIMITS.maxSteps) {
    return ['FINISH'];
  }

  const { location, anchor } = state.slots;

  // Rule 3: location missing, clarification unused -> ask
  if (
    location.mode === 'missing' &&
    state.clarificationsAsked < AGENT_LIMITS.maxClarificationsPerTurn
  ) {
    return ['ASK_CLARIFICATION'];
  }

  // Rule 4: location missing, clarification already used -> finish
  if (location.mode === 'missing') {
    return ['FINISH'];
  }

  // Rule 5: GPS without anchor is inconsistent -> finish
  if (location.mode === 'gps' && anchor === null) {
    return ['FINISH'];
  }

  // Rule 6: place name or address without anchor -> geocode first
  if (anchor === null) {
    return ['geocode_location'];
  }

  // From here on: anchor is set

  // Rule 7: no search attempts left -> finish
  if (state.searchAttempts >= AGENT_LIMITS.maxSearchAttempts) {
    return ['FINISH'];
  }

  // Rule 8: no search yet -> search
  if (state.searchAttempts === 0) {
    return ['google_nearby_search', 'google_text_search'];
  }

  // Rule 9: some searches done -> search again or finish
  return ['google_nearby_search', 'google_text_search', 'FINISH'];
}