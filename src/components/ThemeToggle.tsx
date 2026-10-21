import { Monitor, Moon, Sun } from "lucide-react";
import { useAppState } from "../state/AppStateContext";
import type { Theme } from "../lib/storage";

const options: { id: Theme; label: string; icon: typeof Sun }[] = [
  { id: "system", label: "Systém", icon: Monitor },
  { id: "light", label: "Světlý", icon: Sun },
  { id: "dark", label: "Tmavý", icon: Moon },
];

export function ThemeToggle() {
  const { state, setTheme } = useAppState();

  return (
    <div role="group" aria-label="Vzhled" className="flex gap-1 rounded-md border border-border bg-surface p-1">
      {options.map(({ id, label, icon: Icon }) => {
        const selected = state.theme === id;
        return (
          <button
            key={id}
            type="button"
            aria-pressed={selected}
            onClick={() => setTheme(id)}
            title={label}
            className={`flex h-9 w-9 items-center justify-center rounded-sm transition-colors duration-150 ${
              selected ? "bg-surface-raised text-accent shadow-subtle" : "text-text-muted hover:text-text"
            }`}
          >
            <Icon size={17} strokeWidth={1.75} />
            <span className="sr-only">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
