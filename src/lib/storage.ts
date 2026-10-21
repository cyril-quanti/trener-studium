export type Theme = "system" | "light" | "dark";

export interface CardProgress {
  box: 1 | 2 | 3 | 4 | 5;
  dueAt: number;
  lastReviewed: number;
}

export interface QuestionProgress {
  lastScore: number;
  lastAttemptAt: number;
}

export interface StorageStateV1 {
  version: 1;
  theme: Theme;
  cards: Record<string, CardProgress>;
  questions: Record<string, QuestionProgress>;
}

export const STORAGE_KEY = "trener-studium:v1";

export function defaultState(): StorageStateV1 {
  return { version: 1, theme: "system", cards: {}, questions: {} };
}

function isValidState(value: unknown): value is StorageStateV1 {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    v.version === 1 &&
    (v.theme === "system" || v.theme === "light" || v.theme === "dark") &&
    typeof v.cards === "object" &&
    v.cards !== null &&
    typeof v.questions === "object" &&
    v.questions !== null
  );
}

/** Reads state from localStorage, falling back safely to defaults on any
 * corruption, parse error, or version mismatch (migration safety). */
export function loadState(): StorageStateV1 {
  if (typeof localStorage === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed: unknown = JSON.parse(raw);
    if (!isValidState(parsed)) return defaultState();
    return parsed;
  } catch {
    return defaultState();
  }
}

export function saveState(state: StorageStateV1): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable (private mode) — progress just won't persist.
  }
}

export function clearState(): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
