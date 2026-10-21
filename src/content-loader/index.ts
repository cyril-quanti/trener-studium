import {
  blockMetaSchema,
  cardsFileSchema,
  questionsFileSchema,
  type BlockMeta,
  type Card,
  type Question,
} from "./schema";

export interface TopicContent {
  id: string;
  title: string;
  blockId: string;
  blockNumber: number;
  markdown: string | null;
  cards: Card[];
  questions: Question[];
}

export interface BlockContent {
  id: string;
  number: number;
  title: string;
  topics: TopicContent[];
}

type RawModules = Record<string, unknown>;

function loadModules(useFixtures: boolean) {
  // Both glob calls are statically analyzable by Vite. When
  // VITE_CONTENT_FIXTURES is not set, the `useFixtures` branch is a
  // compile-time constant `false` and esbuild/rollup dead-code-eliminate the
  // fixtures glob (and the files it would otherwise bundle) from production.
  if (useFixtures) {
    return {
      metas: import.meta.glob("../__fixtures__/content/blok-*/meta.json", {
        eager: true,
        import: "default",
      }) as RawModules,
      markdowns: import.meta.glob("../__fixtures__/content/blok-*/*.md", {
        eager: true,
        query: "?raw",
        import: "default",
      }) as RawModules,
      cardsFiles: import.meta.glob("../__fixtures__/content/blok-*/*.cards.json", {
        eager: true,
        import: "default",
      }) as RawModules,
      questionsFiles: import.meta.glob("../__fixtures__/content/blok-*/*.questions.json", {
        eager: true,
        import: "default",
      }) as RawModules,
    };
  }
  return {
    metas: import.meta.glob("../content/blok-*/meta.json", {
      eager: true,
      import: "default",
    }) as RawModules,
    markdowns: import.meta.glob("../content/blok-*/*.md", {
      eager: true,
      query: "?raw",
      import: "default",
    }) as RawModules,
    cardsFiles: import.meta.glob("../content/blok-*/*.cards.json", {
      eager: true,
      import: "default",
    }) as RawModules,
    questionsFiles: import.meta.glob("../content/blok-*/*.questions.json", {
      eager: true,
      import: "default",
    }) as RawModules,
  };
}

function baseName(path: string): string {
  const file = path.split("/").pop() ?? path;
  return file.replace(/\.(md|cards\.json|questions\.json)$/, "");
}

function blockIdFromPath(path: string): string {
  const match = path.match(/blok-(\d+)/);
  return match ? `blok-${match[1]}` : "";
}

let cached: BlockContent[] | null = null;

export function loadBlocks(): BlockContent[] {
  if (cached) return cached;

  const useFixtures = import.meta.env.VITE_CONTENT_FIXTURES === "1";
  const { metas, markdowns, cardsFiles, questionsFiles } = loadModules(useFixtures);

  const markdownByTopic = new Map<string, string>();
  for (const [path, mod] of Object.entries(markdowns)) {
    markdownByTopic.set(`${blockIdFromPath(path)}/${baseName(path)}`, mod as string);
  }

  const cardsByTopic = new Map<string, Card[]>();
  for (const [path, mod] of Object.entries(cardsFiles)) {
    const parsed = cardsFileSchema.safeParse(mod);
    if (parsed.success) {
      cardsByTopic.set(`${blockIdFromPath(path)}/${baseName(path)}`, parsed.data);
    }
  }

  const questionsByTopic = new Map<string, Question[]>();
  for (const [path, mod] of Object.entries(questionsFiles)) {
    const parsed = questionsFileSchema.safeParse(mod);
    if (parsed.success) {
      questionsByTopic.set(`${blockIdFromPath(path)}/${baseName(path)}`, parsed.data);
    }
  }

  const blocks: BlockContent[] = [];
  const metaEntries = Object.entries(metas).sort(([a], [b]) => a.localeCompare(b));

  for (const [, rawMeta] of metaEntries) {
    const parsedMeta = blockMetaSchema.safeParse(rawMeta);
    if (!parsedMeta.success) continue;
    const meta: BlockMeta = parsedMeta.data;

    const topics: TopicContent[] = meta.topics.map((topicMeta) => {
      const key = `${meta.id}/${topicMeta.id}`;
      return {
        id: topicMeta.id,
        title: topicMeta.title,
        blockId: meta.id,
        blockNumber: meta.number,
        markdown: markdownByTopic.get(key) ?? null,
        cards: cardsByTopic.get(key) ?? [],
        questions: questionsByTopic.get(key) ?? [],
      };
    });

    blocks.push({ id: meta.id, number: meta.number, title: meta.title, topics });
  }

  blocks.sort((a, b) => a.number - b.number);
  cached = blocks;
  return blocks;
}

export function findTopic(blocks: BlockContent[], blockId: string, topicId: string): TopicContent | undefined {
  return blocks.find((b) => b.id === blockId)?.topics.find((t) => t.id === topicId);
}

export function allTopics(blocks: BlockContent[]): TopicContent[] {
  return blocks.flatMap((b) => b.topics);
}
