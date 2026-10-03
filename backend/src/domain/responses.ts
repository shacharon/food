import type { Coordinates } from './coordinates.js';
import type { RadiusSource } from './slots.js';
import type { AgentStatus, FinishReason } from './status.js';
import type { TraceEvent } from './trace.js';
import type { VerifiedPlace } from './verified-place.js';

export interface AgentResponseMeta {
  readonly finishReason: FinishReason;
  readonly steps: number;
  readonly searchAttempts: number;
  readonly radiusMeters: number;
  readonly radiusSource: RadiusSource;
}

export interface AgentResponse {
  readonly reply: string;
  readonly status: AgentStatus;
  /** Set only when status is need_input. */
  readonly question: string | null;
  readonly anchors: readonly Coordinates[];
  readonly places: readonly VerifiedPlace[];
  readonly meta: AgentResponseMeta;
  readonly trace: readonly TraceEvent[];
}
