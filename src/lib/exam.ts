import type { BlockContent, Question } from "../content-loader";

export interface TicketItem {
  blockId: string;
  blockNumber: number;
  blockTitle: string;
  question: Question;
}

/** Draws one random question from each selected block (pooling questions
 * across all of the block's topics). Blocks with no questions are skipped. */
export function drawTicket(
  blocks: BlockContent[],
  selectedBlockIds: string[],
  rng: () => number = Math.random,
): TicketItem[] {
  const ticket: TicketItem[] = [];
  for (const blockId of selectedBlockIds) {
    const block = blocks.find((b) => b.id === blockId);
    if (!block) continue;
    const pool = block.topics.flatMap((t) => t.questions);
    if (pool.length === 0) continue;
    const index = Math.floor(rng() * pool.length);
    ticket.push({
      blockId: block.id,
      blockNumber: block.number,
      blockTitle: block.title,
      question: pool[index],
    });
  }
  return ticket;
}
