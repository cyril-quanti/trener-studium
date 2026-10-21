import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { loadBlocks } from "../content-loader";
import { useAppState } from "../state/AppStateContext";
import { topicMastery } from "../lib/mastery";
import { ProgressRing } from "../components/ProgressRing";
import { Card } from "../components/Card";

export function BlockPage() {
  const { blockId = "" } = useParams();
  const blocks = loadBlocks();
  const block = blocks.find((b) => b.id === blockId);
  const { state } = useAppState();

  if (!block) return <Navigate to="/" replace />;

  return (
    <div className="animate-fade-in space-y-6">
      <header>
        <p className="text-xs font-medium tabular-nums text-text-muted">Blok {block.number}</p>
        <h1 className="text-2xl font-semibold tracking-tight text-text">{block.title}</h1>
      </header>

      <div className="space-y-2">
        {block.topics.map((topic) => {
          const mastery = topicMastery(topic, state);
          return (
            <Link
              key={topic.id}
              to={`/blok/${block.id}/${topic.id}`}
              className="block focus-visible:outline-offset-4"
            >
              <Card interactive className="flex items-center justify-between gap-4 p-4">
                <span className="text-sm font-medium text-text">{topic.title}</span>
                <span className="flex items-center gap-3">
                  {mastery !== undefined && <ProgressRing value={mastery} size={36} strokeWidth={3.5} />}
                  <ArrowRight size={16} strokeWidth={1.75} className="text-text-muted" />
                </span>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
