import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Check, X } from "lucide-react";
import { loadBlocks, type TopicContent } from "../content-loader";
import { useAppState } from "../state/AppStateContext";
import { isDue, newCardProgress } from "../lib/leitner";
import { Flashcard } from "../components/Flashcard";
import { Button } from "../components/Button";
import { ButtonLink } from "../components/ButtonLink";
import { EmptyState } from "../components/EmptyState";
import { Card } from "../components/Card";

interface SessionCard {
  card: TopicContent["cards"][number];
  topicTitle: string;
}

export function FlashcardSessionPage() {
  const [searchParams] = useSearchParams();
  const scope = searchParams.get("scope") ?? "all";
  const id = searchParams.get("id") ?? "";
  const blocks = loadBlocks();
  const { state, reviewCard } = useAppState();
  const now = Date.now();

  const sessionCards = useMemo<SessionCard[]>(() => {
    let pool: SessionCard[] = [];
    if (scope === "topic") {
      const [blockId, topicId] = id.split(":");
      const topic = blocks.find((b) => b.id === blockId)?.topics.find((t) => t.id === topicId);
      pool = (topic?.cards ?? []).map((card) => ({ card, topicTitle: topic?.title ?? "" }));
    } else if (scope === "block") {
      const block = blocks.find((b) => b.id === id);
      pool = (block?.topics ?? []).flatMap((t) => t.cards.map((card) => ({ card, topicTitle: t.title })));
    } else {
      pool = blocks
        .flatMap((b) => b.topics.flatMap((t) => t.cards.map((card) => ({ card, topicTitle: t.title }))))
        .filter(({ card }) => isDue(state.cards[card.id] ?? newCardProgress(now), now));
    }
    return pool;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope, id, blocks.length]);

  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);

  const current = sessionCards[index];
  const done = sessionCards.length > 0 && index >= sessionCards.length;

  const mark = (knew: boolean) => {
    if (!current) return;
    reviewCard(current.card.id, knew);
    setResults((prev) => [...prev, knew]);
    setFlipped(false);
    setIndex((i) => i + 1);
  };

  useEffect(() => {
    if (!current || done) return;
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (e.code === "ArrowLeft" && flipped) {
        mark(false);
      } else if (e.code === "ArrowRight" && flipped) {
        mark(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, flipped, done]);

  if (sessionCards.length === 0) {
    return (
      <div className="animate-fade-in">
        <EmptyState title="Žádné kartičky k zopakování" description="Zatím tu není co procvičovat." />
      </div>
    );
  }

  if (done) {
    const knownCount = results.filter(Boolean).length;
    return (
      <div className="animate-fade-in mx-auto max-w-sm space-y-6 text-center">
        <h1 className="text-xl font-semibold tracking-tight text-text">Session dokončena</h1>
        <Card className="flex items-center justify-around p-6">
          <div>
            <p className="text-2xl font-semibold tabular-nums text-success">{knownCount}</p>
            <p className="text-sm text-text-muted">Umím</p>
          </div>
          <div>
            <p className="text-2xl font-semibold tabular-nums text-danger">{results.length - knownCount}</p>
            <p className="text-sm text-text-muted">Neumím</p>
          </div>
        </Card>
        <ButtonLink to="/">Zpět na Domů</ButtonLink>
      </div>
    );
  }

  return (
    <div className="animate-fade-in mx-auto max-w-lg space-y-5">
      <p className="text-center text-sm font-medium tabular-nums text-text-muted">
        {index + 1} / {sessionCards.length} · {current.topicTitle}
      </p>
      <Flashcard front={current.card.front} back={current.card.back} flipped={flipped} onFlip={() => setFlipped((f) => !f)} />
      <div className="flex justify-center gap-3">
        <Button variant="secondary" icon={<X size={16} strokeWidth={1.75} />} onClick={() => mark(false)} disabled={!flipped}>
          Neumím
        </Button>
        <Button icon={<Check size={16} strokeWidth={1.75} />} onClick={() => mark(true)} disabled={!flipped}>
          Umím
        </Button>
      </div>
      <p className="text-center text-xs text-text-muted">Mezerník = otočit · ← Neumím · → Umím</p>
    </div>
  );
}
