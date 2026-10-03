export interface AgentLimits {
  readonly maxSteps: 6;
  readonly maxSearchAttempts: 2;
  readonly maxClarificationsPerTurn: 1;
  readonly defaultRadiusMeters: 300;
  readonly widenedRadiusMeters: 800;
}

export const AGENT_LIMITS: AgentLimits = {
  maxSteps: 6,
  maxSearchAttempts: 2,
  maxClarificationsPerTurn: 1,
  defaultRadiusMeters: 300,
  widenedRadiusMeters: 800,
};
