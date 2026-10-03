import type { Slots } from '../slots.js';
import type { VerifiedPlace } from '../verified-place.js';
import type { RawPlace } from './raw-place.js';

export interface VerifyInput {
  readonly candidates: readonly RawPlace[];
  readonly slots: Slots;
}

export type RejectionReason = 'too_far' | 'closed' | 'cuisine_mismatch';

export interface RejectedPlace {
  readonly placeId: string;
  readonly reason: RejectionReason;
}

export interface VerifyOutput {
  readonly places: readonly VerifiedPlace[];
  readonly rejected: readonly RejectedPlace[];
}

/**
 * filter_and_verify: a synchronous, deterministic contract (not a Tool).
 * Checks distance, opening state and cuisine/dish fit in code.
 */
export interface ResultVerifier {
  verify(input: VerifyInput): VerifyOutput;
}
