export type AgentErrorCode =
  | 'geocode_failed'
  | 'search_failed'
  | 'zero_hits'
  | 'invalid_tool_input'
  | 'llm_failed'
  | 'max_steps_exceeded'
  | 'unknown';

export interface AgentError {
  readonly code: AgentErrorCode;
  readonly message: string;
  /** Soft failures are eligible for the single allowed retry. */
  readonly soft: boolean;
}
