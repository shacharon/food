import type { Coordinates } from './coordinates.js';
import type { AgentError } from './errors.js';
import type { Slots } from './slots.js';
import type { FinishReason } from './status.js';
import type { RawPlace } from './tools/raw-place.js';
import type { TraceEvent } from './trace.js';
import type { VerifiedPlace } from './verified-place.js';

/** Input for a single user turn. */
export interface AgentSession {
  readonly id: string;
  readonly turn: number;
  readonly userMessage: string;
  /** Device GPS, when the client provided it. */
  readonly gps: Coordinates | null;
}

export interface AgentStateBase {
  readonly sessionId: string;
  readonly step: number;
  readonly searchAttempts: number;
  readonly clarificationsAsked: number;
  readonly slots: Slots;
  /** Trace data only; recording behavior lives behind TraceRecorder. */
  readonly trace: readonly TraceEvent[];
}

export interface SearchingState extends AgentStateBase {
  readonly status: 'searching';
  readonly candidates: readonly RawPlace[];
}

export interface NeedInputState extends AgentStateBase {
  readonly status: 'need_input';
  readonly missing: 'location';
  readonly question: string;
  readonly finishReason: 'missing_location';
}

export interface DoneState extends AgentStateBase {
  readonly status: 'done';
  readonly finishReason: Extract<
    FinishReason,
    'verified' | 'no_results_explicit_radius' | 'radius_widened' | 'max_steps'
  >;
  readonly places: readonly VerifiedPlace[];
}

export interface FailedState extends AgentStateBase {
  readonly status: 'failed';
  readonly finishReason: Extract<FinishReason, 'failed' | 'max_steps'>;
  readonly error: AgentError;
}

export type AgentState =
  | SearchingState
  | NeedInputState
  | DoneState
  | FailedState;
