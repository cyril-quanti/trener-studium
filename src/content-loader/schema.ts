import { z } from "zod";

export const topicMetaSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  title: z.string().min(1),
});

export const blockMetaSchema = z.object({
  id: z.string().regex(/^blok-[1-6]$/),
  number: z.number().int().min(1).max(6),
  title: z.string().min(1),
  topics: z.array(topicMetaSchema).min(1),
});

export const cardSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+-c\d{2}$/),
  front: z.string().min(1),
  back: z.string().min(1),
});

export const cardsFileSchema = z.array(cardSchema);

export const questionSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+-q\d{2}$/),
  question: z.string().min(1),
  modelAnswer: z.string().min(1),
  keyPoints: z.array(z.string().min(1)).min(3).max(7),
});

export const questionsFileSchema = z.array(questionSchema);

export type TopicMeta = z.infer<typeof topicMetaSchema>;
export type BlockMeta = z.infer<typeof blockMetaSchema>;
export type Card = z.infer<typeof cardSchema>;
export type Question = z.infer<typeof questionSchema>;
