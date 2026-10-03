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

describe('ToolCall search shapes', () => {
  const circle = { center: { lat: 32.08, lng: 34.78 }, radiusMeters: 1500 } as const;

  it('accepts the new nearby and text shapes', () => {
    const nearby: ToolCall = {
      tool: 'google_nearby_search',
      input: { includedTypes: ['sushi_restaurant'], locationRestriction: circle },
    };
    const text: ToolCall = {
      tool: 'google_text_search',
      input: { textQuery: 'carbonara', locationBias: circle },
    };

    expect([nearby.tool, text.tool]).toEqual(['google_nearby_search', 'google_text_search']);
  });

  it('rejects the old keyword nearby shape', () => {
    const oldShape: ToolCall = {
      tool: 'google_nearby_search',
      input: {
        includedTypes: ['sushi_restaurant'],
        locationRestriction: circle,
        // @ts-expect-error keyword is an excess property; nearby search has no keyword.
        keyword: 'sushi',
      },
    };

    expect(oldShape.tool).toBe('google_nearby_search');
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
