import type { AgentDecision, ToolCall } from './agent-decision.js';
import type { AgentError } from './errors.js';
import type { FinishReason } from './status.js';
import type { ToolName } from './tools/tool.js';

export interface TraceEventBase {
  readonly step: number;
  /** ISO-8601 timestamp. */
  readonly timestamp: string;
}

export interface ModelDecisionTraceEvent extends TraceEventBase {
  readonly type: 'model_decision';
  readonly payload: { readonly decision: AgentDecision };
}

export interface ToolCallTraceEvent extends TraceEventBase {
  readonly type: 'tool_call';
  readonly payload: { readonly call: ToolCall };
}

export interface ToolResultTraceEvent extends TraceEventBase {
  readonly type: 'tool_result';
  readonly payload: {
    readonly tool: ToolName;
    readonly ok: boolean;
    readonly resultCount: number | null;
    readonly error: AgentError | null;
  };
}

export type RetryReason = 'geocode_failed' | 'zero_hits_default_radius';

export interface RetryTraceEvent extends TraceEventBase {
  readonly type: 'retry';
  readonly payload: {
    readonly reason: RetryReason;
    readonly searchAttempt: number;
  };
}

export interface ClarificationTraceEvent extends TraceEventBase {
  readonly type: 'clarification';
  readonly payload: {
    readonly missing: 'location';
    readonly question: string;
  };
}

export interface FailureTraceEvent extends TraceEventBase {
  readonly type: 'failure';
  readonly payload: { readonly error: AgentError };
}

export interface FinishTraceEvent extends TraceEventBase {
  readonly type: 'finish';
  readonly payload: { readonly finishReason: FinishReason };
}

export type TraceEvent =
  | ModelDecisionTraceEvent
  | ToolCallTraceEvent
  | ToolResultTraceEvent
  | RetryTraceEvent
  | ClarificationTraceEvent
  | FailureTraceEvent
  | FinishTraceEvent;
