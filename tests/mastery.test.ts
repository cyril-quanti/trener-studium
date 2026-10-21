import { describe, expect, it } from "vitest";
import { computeMastery, weakestTopics } from "../src/lib/mastery";
import { defaultState, type StorageStateV1 } from "../src/lib/storage";
import type { BlockContent } from "../src/content-loader";

function state(overrides: Partial<StorageStateV1> = {}): StorageStateV1 {
  return { ...defaultState(), ...overrides };
}

describe("computeMastery", () => {
  it("is undefined when there is no content", () => {
    expect(computeMastery([], [], state())).toBeUndefined();
  });

  it("uses only the card share when there are no questions", () => {
    const cards = [{ id: "a" }, { id: "b" }];
    const s = state({ cards: { a: { box: 4, dueAt: 0, lastReviewed: 0 } } });
    expect(computeMastery(cards, [], s)).toBe(50);
  });

  it("uses only the question share when there are no cards", () => {
    const questions = [{ id: "q1" }, { id: "q2" }];
    const s = state({ questions: { q1: { lastScore: 80, lastAttemptAt: 0 }, q2: { lastScore: 40, lastAttemptAt: 0 } } });
    expect(computeMastery([], questions, s)).toBe(60);
  });

  it("splits 50/50 between cards and questions when both exist", () => {
    const cards = [{ id: "a" }, { id: "b" }];
    const questions = [{ id: "q1" }];
    const s = state({
      cards: { a: { box: 4, dueAt: 0, lastReviewed: 0 }, b: { box: 1, dueAt: 0, lastReviewed: 0 } },
      questions: { q1: { lastScore: 100, lastAttemptAt: 0 } },
    });
    // cardShare = 50 (1/2 mastered), questionShare = 100 -> 0.5*50 + 0.5*100 = 75
    expect(computeMastery(cards, questions, s)).toBe(75);
  });
});

describe("weakestTopics", () => {
  const blocks: BlockContent[] = [
    {
      id: "blok-1",
      number: 1,
      title: "Blok 1",
      topics: [
        { id: "t1", title: "Téma 1", blockId: "blok-1", blockNumber: 1, markdown: null, cards: [{ id: "c1", front: "", back: "" }], questions: [] },
        { id: "t2", title: "Téma 2", blockId: "blok-1", blockNumber: 1, markdown: null, cards: [{ id: "c2", front: "", back: "" }], questions: [] },
        { id: "t3", title: "Téma 3 (bez obsahu)", blockId: "blok-1", blockNumber: 1, markdown: null, cards: [], questions: [] },
      ],
    },
  ];

  it("excludes topics with no content and sorts ascending by mastery", () => {
    const s = state({
      cards: {
        c1: { box: 5, dueAt: 0, lastReviewed: 0 },
        c2: { box: 1, dueAt: 0, lastReviewed: 0 },
      },
    });
    const result = weakestTopics(blocks, s, 3);
    expect(result).toHaveLength(2);
    expect(result[0].topic.id).toBe("t2");
    expect(result[1].topic.id).toBe("t1");
  });
});
