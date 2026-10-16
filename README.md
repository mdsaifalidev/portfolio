# Md. Saif Ali — Portfolio

Personal site of **Md. Saif Ali**, Full-Stack Software Engineer (Node.js, microservices, GenAI / RAG).
Built with Next.js 16, TypeScript and Tailwind CSS v4. Its flagship feature is an **"Ask my AI" assistant**:
a RAG chatbot that answers questions about Saif's experience from the site's own content, with citations.

## Features

- **The Datasheet design** — the home page is Saif's datasheet: a paper sheet over a photograph of a steel
  truss with a live "ask my AI" field, a features table, work filed as tabbed folders, a timeline plot
  of months in production, a characteristics table, a letter and an ordering card. Two inks (paper and
  blue-black) plus one spot blue, Archivo in two widths. Built with the emilkowalski, impeccable and
  taste-skill agent skills; the visual system is documented in `DESIGN.md`. WCAG 2.2 AA (axe-checked in
  both themes). Photographs are from Unsplash (free, no credit
  required; sources in `lib/photos.ts`). Drop a square portrait at `public/me.jpg` to replace the
  monogram.
- **HashCash platforms and a capability matrix** — `platforms` and `capabilities` in `content/profile.ts`;
  unreviewed entries stay drafts.
- **AI assistant** — Gemini answers grounded in a build-time embeddings index (no vector database), streamed
  with `[n]` citations that link to the exact section of the site. Guardrails for off-topic, prompt
  injection and private questions; rate-limited with Upstash Redis.
- **Case studies & blog** — MDX with syntax highlighting, tables of contents, RSS and draft support.
- **Contact form** — Server Action → Resend, with validation, honeypot and rate limits.
- **Ctrl / ⌘ + K command palette** — jump anywhere, or type a question and send it to the assistant.
- **SEO** — per-page metadata, generated Open Graph images, JSON-LD (`Person`, `TechArticle`,
  `BlogPosting`), sitemap and robots.
- **Analytics** — Vercel Analytics + Speed Insights with custom events (enabled only when hosted on Vercel).
- **Visitor telemetry** — anonymous visit, unique-visitor (HyperLogLog of salted IP hashes) and country counts in
  Upstash, shown on a dot-matrix world map; recorded only on the Vercel deployment. See `/privacy`.

## Tech stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · MDX (`@next/mdx`, Shiki)
· Vercel AI SDK v7 + Gemini · Upstash Redis · Resend · cmdk · Vitest · Playwright + axe · Lighthouse CI.

## Getting started

Requires Node 24+ and pnpm 12.

```bash
pnpm install
cp .env.example .env.local   # then fill in the values below
pnpm dev                     # http://localhost:3000
```

| Variable | Used for |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, RSS, social cards (default `https://mdsaifali.vercel.app`) |
| `GEMINI_API_KEY` | Assistant chat + embeddings |
| `GEMINI_CHAT_MODEL`, `GEMINI_THINKING_LEVEL` | Chat model (default `gemini-3.5-flash-lite`, `minimal`) |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Rate limits for the assistant and contact form (optional locally) |
| `CHAT_DAILY_BUDGET` | Max assistant answers per day across all visitors (default 300) |
| `TELEMETRY_SALT` | Secret salt for hashing visitor IPs before counting uniques (any long random string) |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | Contact form email delivery |
| `EVAL_TOKEN` | Lets `pnpm eval:chat` bypass rate limits in development only |

The site builds and renders without any keys; the assistant and contact form need theirs at runtime.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` / `pnpm build` / `pnpm start` | Develop, build (also checks the assistant index), serve |
| `pnpm lint` / `pnpm typecheck` | ESLint / TypeScript |
| `pnpm test` | Unit tests (Vitest) |
| `pnpm test:e2e` | End-to-end + accessibility tests (Playwright, builds and serves the production app) |
| `pnpm ingest` | Re-embed site content for the assistant (no-op when nothing changed; `--force` to rebuild) |
| `pnpm build:map` | Regenerate `public/telemetry/world-dots.json` (only needed to change the map grid) |
| `pnpm eval:chat` | Ask the running dev server 24 test questions and score the answers (uses real Gemini calls) |

## Editing content

- **Profile, experience, projects, platforms, capabilities** — `content/profile.ts` (typed). Wrap a phrase in `**double
  asterisks**` to highlight it as a metric.
- **Case studies** — `content/projects/<slug>.mdx`, enabled with `caseStudy: true` on the project.
- **Blog posts** — metadata in `content/posts.ts`, body in `content/blog/<slug>.mdx`.
- **Drafts** — `draft: true` shows a page only in `pnpm dev` (with a banner); production builds, the
  sitemap, RSS and the assistant all ignore it. Remove the flag to publish.
- **After any content change, run `pnpm ingest`** and commit `lib/rag/index.json` so the assistant knows
  about it. CI fails if the index is stale.
- **Headshot** — drop a square photo at `public/headshot.jpg`; it replaces the monogram in the About pane.
- **HashCash platforms** — HRMS and the real-time communication platform are drafts written from a teammate's
  public description: replace their `TODO(Saif)` lines with your own contribution, then remove `draft: true`
  (and `caseStudy.draft` once the write-up is reviewed).

## The assistant

```
content/ ──► scripts/ingest.ts ──► lib/rag/index.json (chunks + 768-d embeddings)
                                         │
question ──► /api/chat ──► embed query ──► cosine top-6 ──► Gemini (grounded, cited) ──► streamed UI
```

- Knowledge comes only from published content; chunks deep-link to their section.
- The free Gemini tier is tight (the Lite model allows 15 requests/minute). Upstash enforces 10/min and
  40/day per visitor plus a site-wide daily budget; quota errors become a friendly message.
- Quality is tracked with `pnpm eval:chat` (24 cases — facts, refusals, injection, missing info).

## Testing & CI

- **Unit:** knowledge-base integrity (no drafts, valid links/anchors), answer rendering safety, validation.
- **E2E:** navigation, theme persistence, mobile overflow, command palette, assistant (mocked API —
  tests never call Gemini or send email), contact validation, content routes, SEO files, 404.
- **Accessibility:** axe WCAG 2.2 A/AA scans of every page type in both themes, plus open dialogs.
- **CI:** `.github/workflows/ci.yml` runs index check → lint → typecheck → unit → build → E2E →
  Lighthouse CI (desktop scores, CLS, LCP and a 200 KB JS budget). No secrets required.

## Deployment checklist (Vercel)

Full step-by-step instructions: **[DEPLOYMENT.md](DEPLOYMENT.md)**. Summary:

1. Push the repository to GitHub and import it in Vercel.
2. Add every variable from `.env.example` in **Project → Settings → Environment Variables**.
3. Set `NEXT_PUBLIC_SITE_URL` to the final URL (subdomain or custom domain), and a fresh `TELEMETRY_SALT`.
4. **Rotate the Gemini, Upstash and Resend keys** that were shared during development before going live.
5. Optional: verify a domain in Resend and set `CONTACT_FROM_EMAIL` to an address on it.
6. Add the repository link to the Portfolio AI Assistant project in `content/profile.ts`.
7. After deploying, check real-device performance in Vercel Speed Insights / PageSpeed Insights.

## Project structure

```
app/            routes: home, /projects/[slug], /blog, /api/chat, OG images, sitemap, robots
components/     layout, sections, chat, palette, article, mdx blocks
content/        profile.ts, posts.ts, projects/*.mdx, blog/*.mdx
lib/            content helpers, rag/ (sources, retrieval, prompt, index.json), email, rate limits
scripts/        ingest, eval-chat, probe-* dev helpers
tests/          unit (Vitest), e2e (Playwright + axe)
docs/PRD.md     product requirements and as-built notes
```
