import { describe, expect, it } from "vitest";
import { DAY_MS, isDue, isMastered, newCardProgress, review } from "../src/lib/leitner";

describe("leitner scheduling", () => {
  const t0 = Date.parse("2024-01-01T00:00:00Z");

  it("starts new cards in box 1, always due", () => {
    const progress = newCardProgress(t0);
    expect(progress.box).toBe(1);
    expect(isDue(progress, t0)).toBe(true);
    expect(isDue(progress, t0 + 1000)).toBe(true);
  });

  it("advances box on Umím and schedules the correct interval", () => {
    const p1 = newCardProgress(t0);
    const p2 = review(p1, true, t0);
    expect(p2.box).toBe(2);
    expect(p2.dueAt).toBe(t0 + 1 * DAY_MS);

    const p3 = review(p2, true, t0);
    expect(p3.box).toBe(3);
    expect(p3.dueAt).toBe(t0 + 3 * DAY_MS);

    const p4 = review(p3, true, t0);
    expect(p4.box).toBe(4);
    expect(p4.dueAt).toBe(t0 + 7 * DAY_MS);

    const p5 = review(p4, true, t0);
    expect(p5.box).toBe(5);
    expect(p5.dueAt).toBe(t0 + 14 * DAY_MS);
  });

  it("caps box at 5", () => {
    const maxed = { box: 5 as const, dueAt: t0, lastReviewed: t0 };
    const next = review(maxed, true, t0);
    expect(next.box).toBe(5);
  });

  it("resets to box 1 on Neumím", () => {
    const progress = { box: 4 as const, dueAt: t0 + 7 * DAY_MS, lastReviewed: t0 };
    const next = review(progress, false, t0);
    expect(next.box).toBe(1);
    expect(isDue(next, t0)).toBe(true);
  });

  it("is not due before its scheduled interval has elapsed", () => {
    const progress = review(newCardProgress(t0), true, t0); // box 2, due in 1 day
    expect(isDue(progress, t0 + 0.5 * DAY_MS)).toBe(false);
    expect(isDue(progress, t0 + 1 * DAY_MS)).toBe(true);
  });

  it("treats box >= 4 as mastered", () => {
    expect(isMastered(undefined)).toBe(false);
    expect(isMastered({ box: 3, dueAt: t0, lastReviewed: t0 })).toBe(false);
    expect(isMastered({ box: 4, dueAt: t0, lastReviewed: t0 })).toBe(true);
    expect(isMastered({ box: 5, dueAt: t0, lastReviewed: t0 })).toBe(true);
  });
});
