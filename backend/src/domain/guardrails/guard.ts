import type { AgentDecision } from '../agent-decision.js';
import type { AgentState } from '../agent-state.js';
import type { ActionKind } from './action-kind.js';

export type GuardRejection = {
  readonly reason: 'action_not_allowed';
  readonly attempted: ActionKind;
  readonly allowed: readonly ActionKind[];
};

export type GuardResult =
  | { readonly ok: true; readonly decision: AgentDecision }
  | { readonly ok: false; readonly rejection: GuardRejection };

export function guard(decision: AgentDecision, state: AgentState): GuardResult {
  throw new Error('not implemented');
}
