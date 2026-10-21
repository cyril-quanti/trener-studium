import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { loadBlocks } from "../content-loader";
import { useAppState } from "../state/AppStateContext";
import { QuestionReveal } from "../components/QuestionReveal";
import { ButtonLink } from "../components/ButtonLink";
import { EmptyState } from "../components/EmptyState";

export function QuestionPracticePage() {
  const [searchParams] = useSearchParams();
  const topicParam = searchParams.get("topic") ?? "";
  const [blockId, topicId] = topicParam.split(":");
  const blocks = loadBlocks();
  const topic = blocks.find((b) => b.id === blockId)?.topics.find((t) => t.id === topicId);
  const { recordQuestionScore } = useAppState();

  const questions = useMemo(() => topic?.questions ?? [], [topic]);
  const [index, setIndex] = useState(0);
  const [scores, setScores] = useState<number[]>([]);

  if (!topic || questions.length === 0) {
    return <EmptyState title="Žádné otázky k procvičení" description="Pro toto téma zatím nejsou otázky k dispozici." />;
  }

  const done = index >= questions.length;

  if (done) {
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    return (
      <div className="animate-fade-in mx-auto max-w-sm space-y-6 text-center">
        <h1 className="text-xl font-semibold tracking-tight text-text">Procvičování dokončeno</h1>
        <p className="text-sm text-text-muted">Průměrné sebehodnocení: {avg}%</p>
        <ButtonLink to={`/blok/${blockId}/${topicId}?tab=otazky`}>Zpět na téma</ButtonLink>
      </div>
    );
  }

  return (
    <div className="animate-fade-in mx-auto max-w-lg space-y-4">
      <p className="text-center text-sm font-medium tabular-nums text-text-muted">
        Otázka {index + 1} / {questions.length} · {topic.title}
      </p>
      <QuestionReveal
        question={questions[index]}
        confirmLabel={index + 1 < questions.length ? "Další otázka" : "Dokončit"}
        onScored={(score) => {
          recordQuestionScore(questions[index].id, score);
          setScores((prev) => [...prev, score]);
          setIndex((i) => i + 1);
        }}
      />
    </div>
  );
}
