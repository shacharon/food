import type { AgentDecision } from '../agent-decision.js';
import type { AgentSession, AgentState } from '../agent-state.js';

export interface LlmClient {
  decide(session: AgentSession, state: AgentState): Promise<AgentDecision>;
}
