import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { loadBlocks } from "../content-loader";
import { drawTicket } from "../lib/exam";
import { useAppState } from "../state/AppStateContext";
import { QuestionReveal } from "../components/QuestionReveal";
import { ButtonLink } from "../components/ButtonLink";
import { Card } from "../components/Card";
import { EmptyState } from "../components/EmptyState";

export function ExamRunPage() {
  const [searchParams] = useSearchParams();
  const blockIds = useMemo(() => (searchParams.get("blocks") ?? "").split(",").filter(Boolean), [searchParams]);
  const blocks = loadBlocks();
  const ticket = useMemo(() => drawTicket(blocks, blockIds), [blocks, blockIds]);
  const { recordQuestionScore } = useAppState();

  const [index, setIndex] = useState(0);
  const [scores, setScores] = useState<number[]>([]);

  if (ticket.length === 0) {
    return <EmptyState title="Nelze vylosovat zkoušku" description="Vybrané bloky zatím neobsahují otázky." />;
  }

  const done = index >= ticket.length;

  if (done) {
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    return (
      <div className="animate-fade-in mx-auto max-w-lg space-y-6">
        <header className="text-center">
          <h1 className="text-xl font-semibold tracking-tight text-text">Zkouška dokončena</h1>
          <p className="mt-1 text-sm text-text-muted">Průměrné sebehodnocení: {avg}%</p>
        </header>
        <div className="space-y-2">
          {ticket.map((item, i) => (
            <Card key={item.question.id} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <p className="text-xs font-medium tabular-nums text-text-muted">Blok {item.blockNumber}</p>
                <p className="truncate text-sm text-text">{item.question.question}</p>
              </div>
              <span className="shrink-0 text-sm font-semibold tabular-nums text-text">{scores[i]}%</span>
            </Card>
          ))}
        </div>
        <div className="flex justify-center">
          <ButtonLink to="/">Zpět na Domů</ButtonLink>
        </div>
      </div>
    );
  }

  const item = ticket[index];

  return (
    <div className="animate-fade-in mx-auto max-w-lg space-y-4">
      <p className="text-center text-sm font-medium tabular-nums text-text-muted">
        Otázka {index + 1} / {ticket.length} · Blok {item.blockNumber}
      </p>
      <QuestionReveal
        question={item.question}
        confirmLabel={index + 1 < ticket.length ? "Další otázka" : "Dokončit zkoušku"}
        onScored={(score) => {
          recordQuestionScore(item.question.id, score);
          setScores((prev) => [...prev, score]);
          setIndex((i) => i + 1);
        }}
      />
    </div>
  );
}
