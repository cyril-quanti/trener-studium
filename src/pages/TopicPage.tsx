import { useState } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FileText, Layers, ListChecks } from "lucide-react";
import { loadBlocks } from "../content-loader";
import { useAppState } from "../state/AppStateContext";
import { isDue, newCardProgress } from "../lib/leitner";
import { Tabs } from "../components/Tabs";
import { EmptyState } from "../components/EmptyState";
import { Card } from "../components/Card";
import { ButtonLink } from "../components/ButtonLink";

type TabId = "studium" | "karticky" | "otazky";

export function TopicPage() {
  const { blockId = "", topicId = "" } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const blocks = loadBlocks();
  const block = blocks.find((b) => b.id === blockId);
  const topic = block?.topics.find((t) => t.id === topicId);
  const { state } = useAppState();
  const [fallbackTab, setFallbackTab] = useState<TabId>("studium");

  if (!block || !topic) return <Navigate to="/" replace />;

  const activeTab = (searchParams.get("tab") as TabId | null) ?? fallbackTab;
  const setTab = (tab: string) => {
    setFallbackTab(tab as TabId);
    setSearchParams({ tab }, { replace: true });
  };

  const now = Date.now();
  const dueCards = topic.cards.filter((c) => isDue(state.cards[c.id] ?? newCardProgress(now), now));

  return (
    <div className="animate-fade-in space-y-5">
      <header>
        <p className="text-xs font-medium tabular-nums text-text-muted">
          <Link to={`/blok/${block.id}`} className="hover:text-text">
            Blok {block.number}
          </Link>
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-text">{topic.title}</h1>
      </header>

      <Tabs
        tabs={[
          { id: "studium", label: "Studium" },
          { id: "karticky", label: "Kartičky" },
          { id: "otazky", label: "Otázky" },
        ]}
        active={activeTab}
        onChange={setTab}
      />

      {activeTab === "studium" &&
        (topic.markdown ? (
          <div className="prose-cs">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{topic.markdown}</ReactMarkdown>
          </div>
        ) : (
          <EmptyState icon={<FileText size={22} strokeWidth={1.75} />} title="Obsah se připravuje" description="Studijní text pro toto téma zatím není k dispozici." />
        ))}

      {activeTab === "karticky" &&
        (topic.cards.length > 0 ? (
          <Card className="flex items-center justify-between gap-4 p-5">
            <div>
              <p className="text-sm font-medium text-text">{topic.cards.length} kartiček</p>
              <p className="text-sm text-text-muted">
                {dueCards.length > 0 ? `${dueCards.length} splatných dnes` : "Dnes nic nečeká"}
              </p>
            </div>
            <ButtonLink to={`/karticky?scope=topic&id=${block.id}:${topic.id}`} icon={<Layers size={16} strokeWidth={1.75} />}>
              Spustit
            </ButtonLink>
          </Card>
        ) : (
          <EmptyState icon={<Layers size={22} strokeWidth={1.75} />} title="Obsah se připravuje" description="Kartičky pro toto téma zatím nejsou k dispozici." />
        ))}

      {activeTab === "otazky" &&
        (topic.questions.length > 0 ? (
          <div className="space-y-3">
            <Card className="flex items-center justify-between gap-4 p-5">
              <p className="text-sm font-medium text-text">{topic.questions.length} otázek k procvičení</p>
              <ButtonLink
                to={`/otazky?topic=${block.id}:${topic.id}`}
                icon={<ListChecks size={16} strokeWidth={1.75} />}
              >
                Procvičit
              </ButtonLink>
            </Card>
            <ul className="space-y-2">
              {topic.questions.map((q) => (
                <li key={q.id} className="rounded-md border border-border bg-surface-raised px-4 py-3 text-sm text-text">
                  {q.question}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <EmptyState icon={<ListChecks size={22} strokeWidth={1.75} />} title="Obsah se připravuje" description="Otázky k ústní zkoušce pro toto téma zatím nejsou k dispozici." />
        ))}
    </div>
  );
}
