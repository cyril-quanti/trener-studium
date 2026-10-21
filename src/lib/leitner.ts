import type { CardProgress } from "./storage";

export const DAY_MS = 24 * 60 * 60 * 1000;

/** Interval before a card in a given box becomes due again. Box 1 has no
 * interval: it is always due every session. */
const BOX_INTERVAL_DAYS: Record<CardProgress["box"], number> = {
  1: 0,
  2: 1,
  3: 3,
  4: 7,
  5: 14,
};

export function newCardProgress(now: number): CardProgress {
  return { box: 1, dueAt: now, lastReviewed: 0 };
}

export function isDue(progress: CardProgress, now: number): boolean {
  if (progress.box === 1) return true;
  return now >= progress.dueAt;
}

/** Applies a Leitner review outcome and returns the next progress state.
 * Umím (knew) advances the box (max 5); Neumím (did not know) resets to box 1. */
export function review(progress: CardProgress, knew: boolean, now: number): CardProgress {
  const nextBox = knew ? (Math.min(5, progress.box + 1) as CardProgress["box"]) : 1;
  const intervalDays = BOX_INTERVAL_DAYS[nextBox];
  return {
    box: nextBox,
    dueAt: now + intervalDays * DAY_MS,
    lastReviewed: now,
  };
}

export const MASTERED_BOX = 4;

export function isMastered(progress: CardProgress | undefined): boolean {
  return (progress?.box ?? 1) >= MASTERED_BOX;
}
