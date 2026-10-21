import type { BlockContent, TopicContent } from "../content-loader";
import { isMastered } from "./leitner";
import type { StorageStateV1 } from "./storage";

/** Mastery = 50% share of cards mastered (box >= 4) + 50% average question
 * score (latest % key points ticked). Topics / blocks with no cards and no
 * questions have undefined mastery (nothing to measure yet). */
export function computeMastery(
  cards: { id: string }[],
  questions: { id: string }[],
  state: StorageStateV1,
): number | undefined {
  const hasCards = cards.length > 0;
  const hasQuestions = questions.length > 0;
  if (!hasCards && !hasQuestions) return undefined;

  let cardShare: number | undefined;
  if (hasCards) {
    const masteredCount = cards.filter((c) => isMastered(state.cards[c.id])).length;
    cardShare = (masteredCount / cards.length) * 100;
  }

  let questionShare: number | undefined;
  if (hasQuestions) {
    const scores = questions.map((q) => state.questions[q.id]?.lastScore ?? 0);
    questionShare = scores.reduce((a, b) => a + b, 0) / questions.length;
  }

  if (cardShare !== undefined && questionShare !== undefined) {
    return cardShare * 0.5 + questionShare * 0.5;
  }
  return cardShare ?? questionShare;
}

export function topicMastery(topic: TopicContent, state: StorageStateV1): number | undefined {
  return computeMastery(topic.cards, topic.questions, state);
}

export function blockMastery(block: BlockContent, state: StorageStateV1): number | undefined {
  const cards = block.topics.flatMap((t) => t.cards);
  const questions = block.topics.flatMap((t) => t.questions);
  return computeMastery(cards, questions, state);
}

export interface TopicMasteryEntry {
  topic: TopicContent;
  mastery: number;
}

/** The N topics with the lowest measurable mastery, across all blocks.
 * Topics with no content yet are excluded (nothing to review). */
export function weakestTopics(blocks: BlockContent[], state: StorageStateV1, count = 3): TopicMasteryEntry[] {
  const entries: TopicMasteryEntry[] = [];
  for (const block of blocks) {
    for (const topic of block.topics) {
      const mastery = topicMastery(topic, state);
      if (mastery !== undefined) entries.push({ topic, mastery });
    }
  }
  return entries.sort((a, b) => a.mastery - b.mastery).slice(0, count);
}
