import type { TraceEvent } from '../trace.js';

export interface TraceRecorder {
  record(event: TraceEvent): void;
  /** Immutable snapshot of events recorded so far. */
  snapshot(): readonly TraceEvent[];
}
