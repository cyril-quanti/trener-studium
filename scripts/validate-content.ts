/**
 * Validates src/content/ against the content schema described in
 * docs/content-schema.md. Missing topic files are warnings (content is
 * written incrementally by parallel workers); invalid present files are
 * errors that fail the command (and CI).
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  blockMetaSchema,
  cardsFileSchema,
  questionsFileSchema,
} from "../src/content-loader/schema";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.resolve(__dirname, "../src/content");

let errors = 0;
let warnings = 0;

function error(message: string) {
  console.error(`✖ ${message}`);
  errors += 1;
}

function warn(message: string) {
  console.warn(`! ${message}`);
  warnings += 1;
}

function readJson(filePath: string): unknown {
  return JSON.parse(readFileSync(filePath, "utf-8"));
}

if (!existsSync(contentDir)) {
  error(`Content directory not found: ${contentDir}`);
  process.exit(1);
}

const blockDirs = readdirSync(contentDir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && /^blok-\d+$/.test(d.name))
  .map((d) => d.name)
  .sort();

const seenCardIds = new Set<string>();
const seenQuestionIds = new Set<string>();

for (const blockDir of blockDirs) {
  const blockPath = path.join(contentDir, blockDir);
  const metaPath = path.join(blockPath, "meta.json");

  if (!existsSync(metaPath)) {
    error(`${blockDir}: missing meta.json`);
    continue;
  }

  let meta;
  try {
    const rawMeta = readJson(metaPath);
    const parsed = blockMetaSchema.safeParse(rawMeta);
    if (!parsed.success) {
      error(`${blockDir}/meta.json: ${parsed.error.issues.map((i) => i.message).join(", ")}`);
      continue;
    }
    meta = parsed.data;
  } catch (e) {
    error(`${blockDir}/meta.json: invalid JSON (${(e as Error).message})`);
    continue;
  }

  if (meta.id !== blockDir) {
    error(`${blockDir}/meta.json: id "${meta.id}" does not match folder name`);
  }

  const topicIds = new Set<string>();
  for (const topic of meta.topics) {
    if (topicIds.has(topic.id)) {
      error(`${blockDir}/meta.json: duplicate topic id "${topic.id}"`);
    }
    topicIds.add(topic.id);

    const mdPath = path.join(blockPath, `${topic.id}.md`);
    const cardsPath = path.join(blockPath, `${topic.id}.cards.json`);
    const questionsPath = path.join(blockPath, `${topic.id}.questions.json`);

    if (!existsSync(mdPath)) {
      warn(`${blockDir}/${topic.id}.md: missing (content not written yet)`);
    }

    if (!existsSync(cardsPath)) {
      warn(`${blockDir}/${topic.id}.cards.json: missing (content not written yet)`);
    } else {
      try {
        const parsed = cardsFileSchema.safeParse(readJson(cardsPath));
        if (!parsed.success) {
          error(`${blockDir}/${topic.id}.cards.json: ${parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`);
        } else {
          for (const card of parsed.data) {
            if (seenCardIds.has(card.id)) error(`Duplicate card id across content: ${card.id}`);
            seenCardIds.add(card.id);
            if (!card.id.startsWith(`${topic.id}-c`)) {
              error(`${blockDir}/${topic.id}.cards.json: card id "${card.id}" does not match topic prefix`);
            }
          }
        }
      } catch (e) {
        error(`${blockDir}/${topic.id}.cards.json: invalid JSON (${(e as Error).message})`);
      }
    }

    if (!existsSync(questionsPath)) {
      warn(`${blockDir}/${topic.id}.questions.json: missing (content not written yet)`);
    } else {
      try {
        const parsed = questionsFileSchema.safeParse(readJson(questionsPath));
        if (!parsed.success) {
          error(`${blockDir}/${topic.id}.questions.json: ${parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`);
        } else {
          for (const q of parsed.data) {
            if (seenQuestionIds.has(q.id)) error(`Duplicate question id across content: ${q.id}`);
            seenQuestionIds.add(q.id);
            if (!q.id.startsWith(`${topic.id}-q`)) {
              error(`${blockDir}/${topic.id}.questions.json: question id "${q.id}" does not match topic prefix`);
            }
          }
        }
      } catch (e) {
        error(`${blockDir}/${topic.id}.questions.json: invalid JSON (${(e as Error).message})`);
      }
    }
  }
}

console.log(`\n${errors} error(s), ${warnings} warning(s).`);
if (errors > 0) process.exit(1);
