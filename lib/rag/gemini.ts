import { createGoogleGenerativeAI, type GoogleEmbeddingModelOptions } from "@ai-sdk/google";
import { embed, embedMany } from "ai";

export const EMBEDDING_MODEL = "gemini-embedding-001";
export const EMBEDDING_DIMS = 768;
// gemini-3.5-flash-lite: ~1.2 s to first token in testing, and Lite models get a far larger free-tier
// quota than Flash (3.5-flash allowed only 20 requests/day). Thinking support varies by model
// (3.8-flash rejects "minimal"), so the level is configurable alongside the model.
export const CHAT_MODEL = process.env.GEMINI_CHAT_MODEL || "gemini-3.5-flash-lite";
export const THINKING_LEVEL = (process.env.GEMINI_THINKING_LEVEL || "minimal") as
  | "minimal"
  | "low"
  | "medium"
  | "high";

let provider: ReturnType<typeof createGoogleGenerativeAI> | undefined;

export function google() {
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not set");
  provider ??= createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });
  return provider;
}

/** Truncated Gemini embeddings aren't unit length; normalise so a dot product is cosine similarity. */
export function normalize(v: number[]) {
  const norm = Math.hypot(...v) || 1;
  return v.map((x) => x / norm);
}

const options = (taskType: GoogleEmbeddingModelOptions["taskType"]) => ({
  google: { outputDimensionality: EMBEDDING_DIMS, taskType } satisfies GoogleEmbeddingModelOptions,
});

export async function embedDocuments(values: string[]) {
  const { embeddings } = await embedMany({
    model: google().embedding(EMBEDDING_MODEL),
    values,
    maxParallelCalls: 2,
    providerOptions: options("RETRIEVAL_DOCUMENT"),
  });
  return embeddings.map(normalize);
}

export async function embedQuery(value: string) {
  const { embedding } = await embed({
    model: google().embedding(EMBEDDING_MODEL),
    value,
    providerOptions: options("RETRIEVAL_QUERY"),
  });
  return normalize(embedding);
}
