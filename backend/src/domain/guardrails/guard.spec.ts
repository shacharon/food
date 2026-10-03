import { describe, expect, it } from 'vitest';
import type { AgentDecision } from '../agent-decision.js';
import { guard } from './guard.js';
import { gpsState, missingState } from './testing/state-factories.js';

const geocodeDecision: AgentDecision = {
  type: 'CALL_TOOL',
  call: { tool: 'geocode_location', input: { query: 'Dizengoff 10' } },
};
const askDecision: AgentDecision = { type: 'ASK_CLARIFICATION', question: 'Where?' };
const finishDecision: AgentDecision = { type: 'FINISH' };

describe('guard', () => {
  it('decision outside allowedActions -> rejected with action_not_allowed', () => {
    const result = guard(geocodeDecision, gpsState());

    expect(result).toMatchObject({
      ok: false,
      rejection: { reason: 'action_not_allowed', attempted: 'geocode_location' },
    });
  });

  it('allowed decision -> accepted unchanged', () => {
    expect(guard(askDecision, missingState())).toEqual({ ok: true, decision: askDecision });
  });

  it('same decision -> accepted in one state and rejected in another', () => {
    expect(guard(askDecision, missingState())).toEqual({ ok: true, decision: askDecision });
    expect(guard(askDecision, gpsState())).toMatchObject({
      ok: false,
      rejection: { reason: 'action_not_allowed', attempted: 'ASK_CLARIFICATION' },
    });
  });

  it('rejection -> lists the allowed actions of the state', () => {
    const result = guard(finishDecision, missingState());

    expect(result).toMatchObject({
      ok: false,
      rejection: { allowed: ['ASK_CLARIFICATION'] },
    });
  });
});
