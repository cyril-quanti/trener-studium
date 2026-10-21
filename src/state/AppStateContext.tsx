import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { review as leitnerReview, newCardProgress } from "../lib/leitner";
import { clearState, defaultState, loadState, saveState, type StorageStateV1, type Theme } from "../lib/storage";

interface AppStateContextValue {
  state: StorageStateV1;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  reviewCard: (cardId: string, knew: boolean) => void;
  recordQuestionScore: (questionId: string, score: number) => void;
  resetProgress: () => void;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

function getSystemPrefersDark(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StorageStateV1>(() => loadState());
  const [systemDark, setSystemDark] = useState(getSystemPrefersDark);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const resolvedTheme: "light" | "dark" = state.theme === "system" ? (systemDark ? "dark" : "light") : state.theme;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
  }, [resolvedTheme]);

  const setTheme = useCallback((theme: Theme) => {
    setState((prev) => ({ ...prev, theme }));
  }, []);

  const reviewCard = useCallback((cardId: string, knew: boolean) => {
    const now = Date.now();
    setState((prev) => {
      const current = prev.cards[cardId] ?? newCardProgress(now);
      const next = leitnerReview(current, knew, now);
      return { ...prev, cards: { ...prev.cards, [cardId]: next } };
    });
  }, []);

  const recordQuestionScore = useCallback((questionId: string, score: number) => {
    const now = Date.now();
    setState((prev) => ({
      ...prev,
      questions: { ...prev.questions, [questionId]: { lastScore: score, lastAttemptAt: now } },
    }));
  }, []);

  const resetProgress = useCallback(() => {
    clearState();
    setState(defaultState());
  }, []);

  const value = useMemo<AppStateContextValue>(
    () => ({ state, resolvedTheme, setTheme, reviewCard, recordQuestionScore, resetProgress }),
    [state, resolvedTheme, setTheme, reviewCard, recordQuestionScore, resetProgress],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateContextValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
