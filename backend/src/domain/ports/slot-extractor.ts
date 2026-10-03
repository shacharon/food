import type { Coordinates } from '../coordinates.js';
import type { Slots } from '../slots.js';

/** Runs once per turn, before the loop; not an agent-selectable tool. */
export interface SlotExtractor {
  extractSlots(
    message: string,
    gps: Coordinates | null,
    previousSlots: Slots | null,
  ): Promise<Slots>;
}
