import { describe, expect, it } from "vitest";
import { drawTicket } from "../src/lib/exam";
import type { BlockContent } from "../src/content-loader";

const blocks: BlockContent[] = [
  {
    id: "blok-1",
    number: 1,
    title: "Blok 1",
    topics: [
      {
        id: "t1",
        title: "Téma 1",
        blockId: "blok-1",
        blockNumber: 1,
        markdown: null,
        cards: [],
        questions: [
          { id: "t1-q01", question: "Q1", modelAnswer: "A1", keyPoints: ["a", "b", "c"] },
          { id: "t1-q02", question: "Q2", modelAnswer: "A2", keyPoints: ["a", "b", "c"] },
        ],
      },
    ],
  },
  {
    id: "blok-2",
    number: 2,
    title: "Blok 2 (bez otázek)",
    topics: [{ id: "t2", title: "Téma 2", blockId: "blok-2", blockNumber: 2, markdown: null, cards: [], questions: [] }],
  },
];

describe("drawTicket", () => {
  it("draws exactly one question per selected block that has questions", () => {
    const ticket = drawTicket(blocks, ["blok-1", "blok-2"], () => 0);
    expect(ticket).toHaveLength(1);
    expect(ticket[0].blockId).toBe("blok-1");
    expect(ticket[0].question.id).toBe("t1-q01");
  });

  it("uses the provided rng to pick the question index", () => {
    const ticket = drawTicket(blocks, ["blok-1"], () => 0.99);
    expect(ticket[0].question.id).toBe("t1-q02");
  });

  it("returns an empty ticket when no selected block has questions", () => {
    expect(drawTicket(blocks, ["blok-2"], () => 0)).toHaveLength(0);
  });
});
