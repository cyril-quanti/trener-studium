import { Link } from "react-router-dom";
import { ArrowRight, GraduationCap, Layers } from "lucide-react";
import { loadBlocks } from "../content-loader";
import { useAppState } from "../state/AppStateContext";
import { blockMastery, weakestTopics } from "../lib/mastery";
import { isDue, newCardProgress } from "../lib/leitner";
import { Card } from "../components/Card";
import { ProgressRing } from "../components/ProgressRing";
import { ButtonLink } from "../components/ButtonLink";

export function HomePage() {
  const blocks = loadBlocks();
  const { state } = useAppState();
  const now = Date.now();

  const allCards = blocks.flatMap((b) => b.topics.flatMap((t) => t.cards));
  const dueCount = allCards.filter((c) => isDue(state.cards[c.id] ?? newCardProgress(now), now)).length;
  const weakest = weakestTopics(blocks, state, 3);

  return (
    <div className="animate-fade-in space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-text">Domů</h1>
        <p className="mt-1 text-sm text-text-muted">Přehled pokroku napříč bloky.</p>
      </header>

      <section aria-label="Rychlé akce" className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Card className="flex items-center justify-between gap-4 p-4">
          <div>
            <p className="text-sm font-medium text-text">Splatné kartičky</p>
            <p className="text-sm text-text-muted">
              {dueCount > 0 ? `${dueCount} ke zopakování` : "Vše zopakováno"}
            </p>
          </div>
          <ButtonLink
            variant="secondary"
            size="sm"
            icon={<Layers size={16} strokeWidth={1.75} />}
            disabled={dueCount === 0}
            to="/karticky?scope=all"
          >
            Spustit
          </ButtonLink>
        </Card>
        <Card className="flex items-center justify-between gap-4 p-4">
          <div>
            <p className="text-sm font-medium text-text">Simulátor zkoušky</p>
            <p className="text-sm text-text-muted">Vylosujte si ústní zkoušku</p>
          </div>
          <ButtonLink variant="secondary" size="sm" icon={<GraduationCap size={16} strokeWidth={1.75} />} to="/zkouska">
            Spustit
          </ButtonLink>
        </Card>
      </section>

      {weakest.length > 0 && (
        <section aria-label="Nejslabší témata">
          <h2 className="mb-3 text-sm font-semibold tracking-tight text-text">Nejslabší témata</h2>
          <div className="space-y-2">
            {weakest.map(({ topic, mastery }) => (
              <Link
                key={`${topic.blockId}-${topic.id}`}
                to={`/blok/${topic.blockId}/${topic.id}`}
                className="flex min-h-11 items-center justify-between gap-3 rounded-md border border-border bg-surface-raised px-4 py-3 transition-colors duration-150 hover:border-accent/40"
              >
                <span className="text-sm text-text">{topic.title}</span>
                <span className="flex items-center gap-2 text-sm font-medium tabular-nums text-text-muted">
                  {Math.round(mastery)}%
                  <ArrowRight size={16} strokeWidth={1.75} />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section aria-label="Bloky">
        <h2 className="mb-3 text-sm font-semibold tracking-tight text-text">Bloky</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {blocks.map((block) => {
            const mastery = blockMastery(block, state);
            return (
              <Link key={block.id} to={`/blok/${block.id}`}>
                <Card interactive className="flex h-full items-center gap-4 p-4">
                  <ProgressRing value={mastery ?? 0} size={48} strokeWidth={4} />
                  <div className="min-w-0">
                    <p className="text-xs font-medium tabular-nums text-text-muted">Blok {block.number}</p>
                    <p className="truncate text-sm font-medium text-text">{block.title}</p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
