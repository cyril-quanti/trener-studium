import { beforeEach, describe, expect, it } from "vitest";
import { defaultState, loadState, saveState, STORAGE_KEY } from "../src/lib/storage";

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns default state when nothing is stored", () => {
    expect(loadState()).toEqual(defaultState());
  });

  it("round-trips a saved state", () => {
    const s = { ...defaultState(), theme: "dark" as const, cards: { a: { box: 3 as const, dueAt: 1, lastReviewed: 1 } } };
    saveState(s);
    expect(loadState()).toEqual(s);
  });

  it("falls back to defaults on corrupted JSON", () => {
    localStorage.setItem(STORAGE_KEY, "{not json");
    expect(loadState()).toEqual(defaultState());
  });

  it("falls back to defaults on an unknown/future version", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 99, theme: "dark", cards: {}, questions: {} }));
    expect(loadState()).toEqual(defaultState());
  });

  it("falls back to defaults when shape is missing required fields", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, theme: "dark" }));
    expect(loadState()).toEqual(defaultState());
  });
});
