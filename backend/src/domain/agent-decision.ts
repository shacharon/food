import type { GeocodeLocationInput } from './tools/geocode-location.tool.js';
import type { GoogleNearbySearchInput } from './tools/google-nearby-search.tool.js';
import type { GoogleTextSearchInput } from './tools/google-text-search.tool.js';
/** Clarification is a decision, not a tool. */
export interface AskClarificationDecision {
  readonly type: 'ASK_CLARIFICATION';
  readonly question: string;
}

export type ToolCall =
  | { readonly tool: 'geocode_location'; readonly input: GeocodeLocationInput }
  | { readonly tool: 'google_text_search'; readonly input: GoogleTextSearchInput }
  | { readonly tool: 'google_nearby_search'; readonly input: GoogleNearbySearchInput };

export interface CallToolDecision {
  readonly type: 'CALL_TOOL';
  readonly call: ToolCall;
}

export interface FinishDecision {
  readonly type: 'FINISH';
  readonly reply: string;
}

export type AgentDecision =
  | AskClarificationDecision
  | CallToolDecision
  | FinishDecision;
