import type { AgentDecision } from '../agent-decision.js';
import type { AgentState } from '../agent-state.js';
import type { ActionKind } from './action-kind.js';
import { allowedActions } from './allowed-actions.js';
export interface GuardRejection {
  readonly reason: 'action_not_allowed';
  readonly attempted: ActionKind;
  readonly allowed: readonly ActionKind[];
}

export type GuardResult =
  | {
    readonly ok: true;
    readonly decision: AgentDecision;
  }
  | {
    readonly ok: false;
    readonly rejection: GuardRejection;
  };

function actionKindOf(decision: AgentDecision): ActionKind {
  switch (decision.type) {
    case 'ASK_CLARIFICATION':
      return 'ASK_CLARIFICATION';

    case 'FINISH':
      return 'FINISH';

    case 'CALL_TOOL':
      return decision.call.tool;
  }
}

export function guard(
  decision: AgentDecision,
  state: AgentState,
): GuardResult {
  const allowed = allowedActions(state);
  const attempted = actionKindOf(decision);

  if (allowed.includes(attempted)) {
    return {
      ok: true,
      decision,
    };
  }

  return {
    ok: false,
    rejection: {
      reason: 'action_not_allowed',
      attempted,
      allowed,
    },
  };
}