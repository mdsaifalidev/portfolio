@AGENTS.md

# Project notes
- Content lives in `content/` (`profile.ts`, `posts.ts`, `projects/*.mdx`, `blog/*.mdx`); `draft: true` hides a page outside `pnpm dev`.
- After changing content, run `pnpm ingest` and commit `lib/rag/index.json` — CI fails when the assistant index is stale.
- Colours come from tokens in `app/globals.css` (`text-accent`, `text-muted`, `text-warn`, …); keep WCAG AA in both themes (`pnpm test:e2e` runs axe).
- Before committing: `pnpm lint && pnpm typecheck && pnpm test`; run `pnpm test:e2e` for UI changes.
