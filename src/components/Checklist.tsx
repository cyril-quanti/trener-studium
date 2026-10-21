import { Check } from "lucide-react";

interface ChecklistProps {
  items: string[];
  checked: boolean[];
  onToggle: (index: number) => void;
  idPrefix: string;
}

export function Checklist({ items, checked, onToggle, idPrefix }: ChecklistProps) {
  return (
    <ul className="space-y-2">
      {items.map((item, index) => {
        const id = `${idPrefix}-${index}`;
        const isChecked = checked[index] ?? false;
        return (
          <li key={id}>
            <label
              htmlFor={id}
              className="flex min-h-11 cursor-pointer items-start gap-3 rounded-md border border-border bg-surface px-3 py-2.5 transition-colors duration-150 hover:border-accent/40"
            >
              <input
                id={id}
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggle(index)}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border transition-colors duration-150 ${
                  isChecked ? "border-accent bg-accent text-accent-contrast" : "border-border bg-surface-raised"
                }`}
              >
                {isChecked && <Check size={14} strokeWidth={2.5} />}
              </span>
              <span className="text-sm text-text">{item}</span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}
