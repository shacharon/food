export type AgentStatus = 'searching' | 'need_input' | 'done' | 'failed';

export const FINISH_REASONS = [
  'missing_location',
  'verified',
  'no_results_explicit_radius',
  'radius_widened',
  'max_steps',
  'failed',
] as const;

export type FinishReason = (typeof FINISH_REASONS)[number];
