import { describe, expect, it } from 'vitest';
import type { AgentDecision, FinishDecision, ToolCall } from './index.js';

describe('ToolCall', () => {
  it('accepts a real tool and cannot express filter_and_verify', () => {
    const validCall: ToolCall = { tool: 'geocode_location', input: { query: 'Dizengoff 10' } };
    // @ts-expect-error filter_and_verify is not a tool.
    const call: ToolCall = { tool: 'filter_and_verify', input: { query: 'x' } };

    expect(validCall.tool).toBe('geocode_location');
    expect(call.tool).toBe('filter_and_verify');
  });
});

describe('FinishDecision', () => {
  it('is a bare FINISH decision with no free-form text', () => {
    const decision: FinishDecision = { type: 'FINISH' };
    const asAgentDecision: AgentDecision = decision;

    expect(asAgentDecision.type).toBe('FINISH');
  });

  it('cannot carry restaurant text', () => {
    // @ts-expect-error FINISH must not carry a reply; replies are built from verified places.
    const finishWithReply: FinishDecision = { type: 'FINISH', reply: "Try Luigi's" };
    // @ts-expect-error The AgentDecision union must reject restaurant text on FINISH too.
    const decisionWithReply: AgentDecision = { type: 'FINISH', reply: "Try Luigi's" };

    expect(finishWithReply.type).toBe('FINISH');
    expect(decisionWithReply.type).toBe('FINISH');
  });
});
