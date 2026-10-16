# PRD — Md. Saif Ali Portfolio (v1)

## Context
Md. Saif Ali (Full-Stack Software Engineer, 3+ yrs; Node.js, microservices, GenAI/RAG/MCP; currently at HashCash Consultants) needs a portfolio website to **get hired** for Full-Stack / Backend (Node.js) / AI-GenAI roles, including **remote & international** positions. The project folder `C:\xampp\htdocs\Md. Saif Ali - Portfolio` is empty — greenfield build. Source of truth for content: CV (`Downloads/Md. Saif Ali_Resume.pdf`), GitHub `mdsaifalidev`, InsightFlow repo.

Research basis: recruiters spend <10s on a first scan and engage far more with live demos + measurable outcomes; 2026 portfolio norm is minimal, fast, content-first; max 2 typefaces (+ mono for technical labels). Differentiator: the site itself **demonstrates** his RAG skill via a live "Ask my AI" assistant.

**First implementation step:** save this PRD as `docs/PRD.md` in the project.

## As-built status (2026-10-07)
M0–M5 are implemented and committed locally; **deployment is deferred** (see README checklist).

| Area | As built | Deviation from the original plan |
|---|---|---|
| Vector store | Build-time JSON embeddings index + in-memory cosine search | No Neon/pgvector (Saif's call; ~30 chunks don't need a DB) |
| Chat model | `gemini-3.5-flash-lite`, thinking `minimal` (env-overridable) | 3.8-flash took 20 s+; 3.5-flash free tier was 20 req/day |
| Assistant quality | 24-case eval, 24/24 passing | — |
| GitHub activity | Not built | Dropped by Saif in M4 |
| Motion | CSS scroll-driven reveals (desktop only) | No Framer Motion; reveals off on phones for performance |
| Theme | Inline pre-paint script | No `next-themes` (React 19.2 script warnings) |
| Light accent | `#047857` | `#059669` failed WCAG AA (3.6:1) |
| Performance | Desktop Lighthouse 100/100/100/100 on home + case studies; mobile perf 88–91, simulated LCP ≈2.8 s; CLS ≤0.01 | Mobile LCP target (<2.0 s) not met; to re-check on the Vercel deployment with real-device data |
| JS budget | ≤200 KB gz initial (≈150 KB is Next/React itself); chat + palette lazy-loaded | Original 150 KB budget was below the framework baseline |
| Tests | Vitest unit, Playwright E2E + axe (0 violations, both themes), Lighthouse CI | — |
| Redesign (2026-10-15) | Amber terminal theme, request-trace hero, tmux status line; HashCash platforms, capability matrix (an ADR-style systems section was built, then removed as duplicative); visitor telemetry + /privacy | Replaces the "Minimal Dark Engineer" emerald two-column design at Saif's request, kept distinct from a colleague's green terminal portfolio. Mobile perf 82–87 after redesign (was 88–91) |
| Redesign (2026-10-16) | "The Datasheet": paper sheet over a steel-truss photo (Unsplash) with a live ask field, features table, tabbed work folders, months-in-production plot, characteristics table, letter, ordering card; Archivo (one family, two widths), paper/ink/spot-blue palette; tmux status line replaced by a bottom-right stub | Replaces the amber terminal theme at Saif's request, using the emilkowalski, impeccable and taste-skill skills (direction chosen by Saif from impeccable's decision round). Desktop Lighthouse 98/100/100/100; mobile perf 78–82 (was 86–87): heavier variable-width type and a full-bleed photo hero |

---

## 1. Goals & success metrics
| Goal | Metric |
|---|---|
| Recruiter understands who Saif is in <10s | Name, role, 3 specialities, "Open to work · Remote" visible above the fold |
| Prove skills with evidence | Every project/role shows ≥1 measured metric + live link/repo |
| Showcase AI skill live | Chatbot answers ≥90% of eval-set questions correctly, refuses off-topic |
| Fast & polished | Lighthouse ≥95 (all 4), LCP <2.0s, CLS <0.05, initial JS ≤200KB gz (revised — see As-built) |
| Convert | Contact form + resume download + LinkedIn tracked in Vercel Analytics |

Non-goals (v1): CMS/admin panel, i18n, custom domain (Vercel subdomain e.g. `mdsaifali.vercel.app`; domain later), comments on blog.

## 2. Audience
Recruiters (skim, want headline + resume), hiring managers/engineers (want architecture, code, metrics, writing), international/remote companies (want timezone, communication proof).

## 3. Design system
**Direction:** Minimal Dark Engineer — two-column layout inspired by brittanychiang.com.
- **Desktop (≥1024px):** left column (≈40%) sticky: name, headline, one-line pitch, section nav with active-section indicator, headshot, social icons, "Ask my AI" + Resume buttons. Right column (≈60%) scrolls content. Max container 1280px.
- **Mobile:** single column, sticky top bar (name + theme toggle + menu), 16px gutters, no horizontal scroll.
- **Signature details:** subtle cursor-following emerald radial "spotlight" on dark bg (desktop only), cards lift + accent border on hover, mono uppercase section labels.

**Fonts:** Geist Sans (headings/body) + Geist Mono (dates, tags, labels, code) via the `geist` package / `next/font` (self-hosted, zero CLS).
- Name: Geist 600, 44–48px, tracking −0.02em · Section labels: Geist Mono 12–13px uppercase, tracking 0.12em · Body: 16–17px, line-height 1.7 · Max prose width ~68ch.

**Colour tokens** (CSS variables on `:root`, Tailwind v4 `@theme`):
| Token | Dark (default) | Light |
|---|---|---|
| bg | `#09090B` | `#FAFAFA` |
| surface | `#18181B` | `#FFFFFF` |
| border | `#27272A` | `#E4E4E7` |
| text | `#FAFAFA` | `#18181B` |
| muted | `#A1A1AA` | `#52525B` |
| accent (Emerald) | `#34D399` | `#047857` (was `#059669`, failed AA) |
| accent-soft (tag bg) | `rgba(52,211,153,.10)` | `rgba(4,120,87,.08)` |
| warn | `#F59E0B` | `#B45309` |

Emerald chosen: "terminal-green" backend undertone, distinct from the violet AI cliché and teal templates. AA contrast verified in both themes (light accent darkened to emerald-700 in M5 after a contrast audit).

**Theme:** dark default, light toggle, respects OS on first visit (`next-themes`, no flash).
**Motion:** `motion` (Framer Motion) fade/slide-in on scroll, ≤300ms; fully disabled under `prefers-reduced-motion`.
**Accessibility:** WCAG 2.2 AA, visible focus rings, skip-link, keyboard-operable chat/palette, alt text, semantic landmarks.

## 4. Information architecture
| Route | Purpose |
|---|---|
| `/` | Single page: Hero/About · Experience · Projects · Skills · Writing (latest 3) · GitHub activity · Contact |
| `/projects/[slug]` | Case study: problem → architecture diagram → key decisions → metrics → learnings → links |
| `/blog`, `/blog/[slug]` | MDX technical writing, reading time, ToC, code highlighting (Shiki), RSS |
| `/resume.pdf` | Downloadable CV (static file in `public/`) |
| `/api/chat` | Streaming RAG endpoint |
| `/api/og` (or `opengraph-image.tsx`) | Dynamic OG cards per page/post |

## 5. Content
**Headline:** "Full-Stack Software Engineer — I build scalable Node.js backends and production AI systems (RAG, MCP)." Badge: `● Open to work · Remote / Relocation · IST (UTC+5:30)`.

**Experience** (timeline cards, mono dates, tech tags, metric bolded; whole card links where relevant):
HashCash (Sep 2025–Present) · Ayanlabs (Aug 2024–Aug 2025) · Sasefied (Jan–Jun 2024) · E-SUTRA (Jun–Nov 2023) — copy from CV bullets. Plus Education (BCA, BCET 2022–2025) and Udemy Node.js certification.

**Projects (ordered):**
1. **InsightFlow** (flagship) — spreadsheet → dashboard + grounded AI brief; Next.js 16, Fastify, FastAPI + Polars, Postgres, Redis, S3, nginx, Turbo monorepo; p95 filtered queries 368–377ms, 1M-row/86.7MB file → dashboard in ~12s, 189 tests + Playwright, ADRs. Live: useinsightflow.vercel.app · repo.
2. **Multi-tenant RAG & MCP Knowledge Platform** (work, anonymized) — per-tenant KBs, ingestion/chunking/embeddings/pgvector, read-only MCP server, GraphQL API; ~30% less retrieval time.
3. **Portfolio AI Assistant** (this site) — Gemini + pgvector RAG, open-source.
4. **Mock Interview AI** — Gemini, speech-to-text, Stripe subscriptions, Redis. Live: mockaiinterview.vercel.app.
5. **Shopfinity** — Next.js/TS/Prisma/Postgres, JWT refresh rotation, admin dashboard, PayPal. Live: shopfinity-xi.vercel.app.
6. **Event-driven Microservices on AWS EKS** (work, anonymized) — 6+ services, RabbitMQ RPC/events, Helm, ECR, GitHub Actions; ~60% less release effort, 80%+ coverage.
Case-study pages for 1–3 and 6 in v1; cards link to live/repo for 4–5 (case studies optional later).
> Work case studies contain no confidential names, client data, code, or internal metrics beyond what's on the public CV.

**Skills:** grouped chips (Languages · Generative AI · Backend · Frontend · Databases · Cloud & DevOps · Testing) — no progress bars/percentages.

**Blog seed (3 posts, drafted by Claude, reviewed by Saif before publishing):** "Building a multi-tenant RAG platform" · "InsightFlow architecture deep-dive" · "How I built this portfolio's AI assistant".

**Assets Saif provides:** professional headshot (square, ≥800px), latest resume PDF, 2–3 screenshots per project (or Claude captures from live sites).

## 6. Features
### 6.1 "Ask my AI" assistant (flagship)
- **Entry points:** button in sticky sidebar/hero + floating launcher; slide-over panel; lazy-loaded (not in initial JS).
- **UX:** suggested questions ("What's Saif's RAG experience?", "Is he open to remote?", "Tell me about InsightFlow"), streaming answers, source chips linking to the relevant section/case study, "Email Saif" CTA after answers.
- **Stack:** Vercel AI SDK (`ai`, `@ai-sdk/google`) · Gemini Flash (latest available, verified at build time) for chat · Gemini embedding model · **Neon Postgres + pgvector** (HNSW, cosine).
- **Ingestion:** `scripts/ingest.ts` reads `content/` (profile data, projects MDX, blog MDX, resume facts) → heading-aware chunking (~500 tokens, 15% overlap) → embed → upsert with content hash (re-embed only changed chunks). Run manually + in GitHub Actions on content change.
- **Guardrails:** system prompt restricts to Saif's professional profile; answers only from retrieved context; says "I don't know — ask Saif directly" otherwise; refuses off-topic/prompt-injection; no salary/personal info beyond the CV.
- **Abuse/cost control:** Upstash Redis rate limit (e.g., 10 msgs/min, 40/day per IP), max input 500 chars, max 6 turns of history; graceful fallback message + contact link when quota hit.
- **Optional insight:** log anonymized questions (no IP) to Neon to learn what recruiters ask.

### 6.2 Contact
Form (name, email, message) → Server Action → zod validation → honeypot + Upstash rate limit → **Resend** email to `saifmd9536@gmail.com` (free tier; sender `onboarding@resend.dev` until a domain exists). Success/error toasts. Plus direct links: email, LinkedIn, GitHub.

### 6.3 GitHub activity
Contribution calendar + pinned repos via GitHub GraphQL API (server-side token), ISR revalidate every 24h; graceful hide on failure.

### 6.4 Command palette (Ctrl/⌘+K)
`cmdk`: jump to sections/projects/posts, toggle theme, copy email, download resume, open chat.

### 6.5 SEO & sharing
Metadata API per page, dynamic OG images (`next/og`) for home/projects/posts, JSON-LD `Person` + `BlogPosting`, `sitemap.ts`, `robots.ts`, RSS feed, canonical URLs. Keywords: Full-Stack, Node.js, Backend, RAG, MCP, GenAI engineer, remote.

### 6.6 Analytics
`@vercel/analytics` + `@vercel/speed-insights`; custom events: resume_download, chat_open, chat_message, contact_submit, project_link_click.

## 7. Technical architecture
- **Framework:** Next.js (latest stable, App Router, RSC) + TypeScript (strict) + Tailwind CSS v4 · **pnpm**.
- **UI:** shadcn/ui primitives (Dialog/Sheet, Button, Tooltip, Sonner toasts) restyled to tokens · `lucide-react` icons · `next-themes` · `motion` · `cmdk`.
- **Content:** Velite (typed MDX collections with zod schemas) for projects + blog; `content/profile.ts` typed data for experience/skills/links (single source for both UI and RAG ingestion).
- **Backend services:** Neon (pgvector) · Upstash Redis · Resend · Gemini API · GitHub API — all free tiers. Secrets in `.env.local` / Vercel env vars; `.env.example` committed.
- **Hosting:** Vercel Hobby, `*.vercel.app`; GitHub repo `mdsaifalidev/portfolio` (public, good README — it's also a showcase).
- **CI:** GitHub Actions — lint, typecheck, unit tests, build, Playwright smoke, Lighthouse CI; ingest job on `content/**` changes.

Proposed structure:
```
app/            (page.tsx, projects/[slug], blog/[slug], api/chat, api/og, sitemap.ts, robots.ts)
components/     (layout/Sidebar, sections/*, chat/*, command-palette, theme-toggle, spotlight)
content/        (profile.ts, projects/*.mdx, blog/*.mdx)
lib/            (rag/{embed,retrieve,prompt}.ts, db.ts, ratelimit.ts, github.ts, analytics.ts)
scripts/        (ingest.ts)
public/         (resume.pdf, headshot, project images)
docs/PRD.md
```

## 8. Milestones
| # | Scope |
|---|---|
| M0 | Scaffold Next.js/TS/Tailwind v4/pnpm, tokens, fonts, theme toggle, layout shell (sticky sidebar + mobile nav), save `docs/PRD.md` |
| M1 | Home sections from `content/profile.ts`: About, Experience, Projects grid, Skills, Contact links, spotlight + animations |
| M2 | Velite MDX: project case studies (InsightFlow, RAG/MCP, AI assistant, EKS) + blog with 3 drafted posts, RSS |
| M3 | AI assistant: Neon pgvector schema, ingest script, `/api/chat` streaming, chat UI, rate limiting, eval set |
| M4 | Contact form (Resend), GitHub activity, command palette, OG images, analytics events |
| M5 | SEO/JSON-LD, a11y + perf pass, Playwright + Lighthouse CI, README, deploy to Vercel |

## 9. Verification
- `pnpm lint && pnpm typecheck && pnpm build` clean.
- Playwright smoke: nav scroll + active indicator, theme toggle persists, Ctrl+K palette, contact form (Resend mocked), chat panel streams (mocked model), case-study + blog routes render, mobile viewport 375px no horizontal scroll.
- Chat eval: ~20 Q&A pairs (e.g., "Where does Saif work now?" → HashCash; "InsightFlow p95?" → 368–377ms; "Write me a poem" → polite refusal) run via script against real Gemini; ≥90% pass.
- Lighthouse CI ≥95 on `/`, a case study, a blog post (mobile + desktop).
- Manual: run `pnpm dev`, check both themes, reduced-motion, keyboard-only navigation, real contact email delivery, deployed preview on Vercel.

## 10. Prerequisites from Saif (before M3/M4)
Gemini API key · Neon project (pgvector enabled) · Upstash Redis DB · Resend API key · GitHub personal access token (read-only) · headshot · confirm employer-anonymized case studies are OK to publish.
