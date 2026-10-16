import index from "./index.json";
import { embedQuery } from "./gemini";

type IndexedChunk = { id: string; title: string; url: string; text: string; embedding: number[] };

const chunks = (index as { chunks: IndexedChunk[] }).chunks;
const TOP_K = 6;

const dot = (a: number[], b: number[]) => {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
  return sum;
};

/**
 * In-memory cosine search over the build-time index (embeddings are pre-normalised).
 * The profile chunk is always included so basic questions ("where is he based?") never miss.
 */
export async function retrieve(query: string) {
  const q = await embedQuery(query);
  const ranked = chunks
    .map((chunk) => ({ chunk, score: dot(q, chunk.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, TOP_K)
    .map((r) => r.chunk);

  if (!ranked.some((c) => c.id === "profile")) {
    const profile = chunks.find((c) => c.id === "profile");
    if (profile) ranked.push(profile);
  }
  return ranked;
}
