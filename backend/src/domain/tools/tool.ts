import type { AgentError } from '../errors.js';

/** Clarification is intentionally absent: it is an AgentDecision, not a tool. */
export type ToolName =
  | 'geocode_location'
  | 'google_text_search'
  | 'google_nearby_search';

export type ToolResult<O> =
  | { readonly ok: true; readonly value: O }
  | { readonly ok: false; readonly error: AgentError };

export interface Tool<I, O> {
  readonly name: ToolName;
  execute(input: I): Promise<ToolResult<O>>;
}
