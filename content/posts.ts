// Blog post metadata. Bodies live in content/blog/<slug>.mdx.
// Drafts only render in `pnpm dev`; set `draft: false` (or remove it) to publish.

export type Post = {
  slug: string;
  title: string;
  summary: string;
  /** ISO date, YYYY-MM-DD */
  date: string;
  tags: string[];
  draft?: boolean;
};

export const posts: Post[] = [
  {
    slug: "how-i-built-this-portfolios-ai-assistant",
    title: "How I built this portfolio's AI assistant",
    summary:
      "RAG without a vector database: indexing the site's own content, writing chunks the way people ask, choosing a model by measuring it, and testing the result.",
    date: "2026-10-07",
    tags: ["RAG", "Gemini", "Next.js", "AI SDK"],
    draft: true,
  },
  {
    slug: "insightflow-grounded-ai-briefs",
    title: "InsightFlow: computing every number before the LLM speaks",
    summary:
      "How InsightFlow keeps AI-written dashboard briefs honest: a Polars facts engine, citation placeholders and a validator that rejects any number the model didn't get from a computed fact.",
    date: "2026-10-07",
    tags: ["AI", "LLM", "Python", "Polars", "Architecture"],
    draft: true,
  },
  {
    slug: "building-a-multi-tenant-rag-platform",
    title: "Building a multi-tenant RAG platform: lessons from production",
    summary:
      "Tenant isolation, chunking, embeddings in pgvector, retrieval quality and giving AI agents governed access through a read-only MCP server.",
    date: "2026-10-07",
    tags: ["RAG", "MCP", "pgvector", "LangChain", "Node.js"],
    draft: true,
  },
];
