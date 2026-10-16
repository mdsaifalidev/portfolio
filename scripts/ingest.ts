// Builds lib/rag/index.json: embeds every published content chunk for the portfolio assistant.
//   pnpm ingest          re-embed if content changed (no API calls otherwise)
//   pnpm ingest --force  always re-embed
//   pnpm ingest --check  only report whether the index is stale (used by prebuild; never fails)
//   --check --strict     same, but exit 1 when stale (used by CI)
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { EMBEDDING_DIMS, EMBEDDING_MODEL, embedDocuments } from "@/lib/rag/gemini";
import { buildChunks } from "@/lib/rag/sources";

const INDEX_PATH = path.join(process.cwd(), "lib", "rag", "index.json");
const args = new Set(process.argv.slice(2));

async function main() {
  const chunks = buildChunks();
  const sourceHash = createHash("sha256")
    .update(JSON.stringify({ EMBEDDING_MODEL, EMBEDDING_DIMS, chunks }))
    .digest("hex");

  const existing = fs.existsSync(INDEX_PATH)
    ? (JSON.parse(fs.readFileSync(INDEX_PATH, "utf8")) as { sourceHash?: string })
    : undefined;
  const stale = existing?.sourceHash !== sourceHash;

  if (args.has("--check")) {
    console.log(
      stale
        ? "⚠ Assistant index is stale — content changed since the last `pnpm ingest`."
        : "✓ Assistant index is up to date.",
    );
    if (stale && args.has("--strict")) process.exitCode = 1;
    return;
  }

  if (!stale && !args.has("--force")) {
    console.log(`✓ Index up to date (${chunks.length} chunks). Nothing to embed.`);
    return;
  }

  // Gemini embeds the title together with the text, which helps short chunks retrieve well.
  const embeddings = await embedDocuments(chunks.map((c) => `${c.title}\n\n${c.text}`));

  const index = {
    model: EMBEDDING_MODEL,
    dims: EMBEDDING_DIMS,
    sourceHash,
    generatedAt: new Date().toISOString(),
    chunks: chunks.map((c, i) => ({
      ...c,
      // 5 decimals keeps the file small with no measurable effect on ranking.
      embedding: embeddings[i].map((x) => Math.round(x * 1e5) / 1e5),
    })),
  };

  fs.writeFileSync(INDEX_PATH, JSON.stringify(index));
  const kb = Math.round(fs.statSync(INDEX_PATH).size / 1024);
  console.log(`✓ Embedded ${chunks.length} chunks with ${EMBEDDING_MODEL} (${EMBEDDING_DIMS}d) → lib/rag/index.json (${kb} KB)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
