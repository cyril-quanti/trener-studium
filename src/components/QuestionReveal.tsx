import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Eye } from "lucide-react";
import type { Question } from "../content-loader";
import { Checklist } from "./Checklist";
import { Button } from "./Button";
import { Card } from "./Card";

interface QuestionRevealProps {
  question: Question;
  onScored: (score: number) => void;
  confirmLabel: string;
}

export function QuestionReveal({ question, onScored, confirmLabel }: QuestionRevealProps) {
  const [revealed, setRevealed] = useState(false);
  const [checked, setChecked] = useState<boolean[]>(() => question.keyPoints.map(() => false));

  useEffect(() => {
    setRevealed(false);
    setChecked(question.keyPoints.map(() => false));
  }, [question]);

  const tickedCount = checked.filter(Boolean).length;
  const score = Math.round((tickedCount / question.keyPoints.length) * 100);

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-text-muted">Otázka</p>
        <p className="mt-2 text-lg font-medium text-text">{question.question}</p>
      </Card>

      {!revealed ? (
        <Button variant="secondary" icon={<Eye size={16} strokeWidth={1.75} />} onClick={() => setRevealed(true)}>
          Zobrazit vzorovou odpověď
        </Button>
      ) : (
        <div className="animate-fade-in space-y-4">
          <Card className="p-5">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-accent">Vzorová odpověď</p>
            <div className="prose-cs">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{question.modelAnswer}</ReactMarkdown>
            </div>
          </Card>

          <div>
            <p className="mb-2 text-sm font-medium text-text">Zmínil(a) jsem body ({tickedCount}/{question.keyPoints.length}):</p>
            <Checklist
              items={question.keyPoints}
              checked={checked}
              idPrefix={question.id}
              onToggle={(index) =>
                setChecked((prev) => prev.map((value, i) => (i === index ? !value : value)))
              }
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium tabular-nums text-text-muted">Sebehodnocení: {score}%</p>
            <Button onClick={() => onScored(score)}>{confirmLabel}</Button>
          </div>
        </div>
      )}
    </div>
  );
}
