import type { AgentState } from '../agent-state.js';
import type { ActionKind } from './action-kind.js';

export function allowedActions(state: AgentState): readonly ActionKind[] {
  throw new Error('not implemented');
}
