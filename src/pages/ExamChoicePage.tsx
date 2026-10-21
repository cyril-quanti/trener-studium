import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { loadBlocks } from "../content-loader";
import { Button } from "../components/Button";
import { Card } from "../components/Card";

export function ExamChoicePage() {
  const blocks = loadBlocks();
  const [selected, setSelected] = useState<string[]>(() => blocks.map((b) => b.id));
  const navigate = useNavigate();

  const toggle = (blockId: string) => {
    setSelected((prev) => (prev.includes(blockId) ? prev.filter((id) => id !== blockId) : [...prev, blockId]));
  };

  const hasQuestions = (blockId: string) =>
    blocks.find((b) => b.id === blockId)?.topics.some((t) => t.questions.length > 0) ?? false;

  const start = () => {
    const chosen = selected.filter(hasQuestions);
    navigate(`/zkouska/beh?blocks=${chosen.join(",")}`);
  };

  const anyChosenHasQuestions = selected.some(hasQuestions);

  return (
    <div className="animate-fade-in space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-text">Simulátor ústní zkoušky</h1>
        <p className="mt-1 text-sm text-text-muted">
          Vyberte bloky, ze kterých se vylosuje jedna otázka z každého – bez časového limitu.
        </p>
      </header>

      <div className="space-y-2">
        {blocks.map((block) => {
          const checked = selected.includes(block.id);
          const available = hasQuestions(block.id);
          return (
            <label
              key={block.id}
              className={`flex min-h-11 items-center justify-between gap-3 rounded-md border px-4 py-3 transition-colors duration-150 ${
                available ? "cursor-pointer border-border bg-surface-raised hover:border-accent/40" : "cursor-not-allowed border-border bg-surface opacity-50"
              }`}
            >
              <span className="text-sm text-text">
                Blok {block.number} · {block.title}
                {!available && <span className="ml-2 text-xs text-text-muted">(obsah se připravuje)</span>}
              </span>
              <span className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  disabled={!available}
                  onChange={() => toggle(block.id)}
                />
                <span
                  aria-hidden="true"
                  className={`flex h-5 w-5 items-center justify-center rounded-sm border ${
                    checked ? "border-accent bg-accent text-accent-contrast" : "border-border bg-surface"
                  }`}
                >
                  {checked && <Check size={14} strokeWidth={2.5} />}
                </span>
              </span>
            </label>
          );
        })}
      </div>

      <Card className="flex items-center justify-between gap-4 p-4">
        <p className="text-sm text-text-muted">{selected.filter(hasQuestions).length} bloků vybráno</p>
        <Button onClick={start} disabled={!anyChosenHasQuestions}>
          Zahájit zkoušku
        </Button>
      </Card>
    </div>
  );
}
