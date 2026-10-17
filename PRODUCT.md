# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Recruiters and hiring managers filling Full-Stack, Node.js backend and AI/GenAI engineering roles, including remote and international teams. They skim a first screen in under ten seconds, then either leave or look for proof (measured results, live work, architecture). Engineers and tech leads are the second reader: they open case studies to judge depth.

## Product Purpose
The personal site of Md. Saif Ali, Full-Stack Software Engineer (3+ years; Node.js, event-driven microservices, Generative AI with RAG and MCP), currently a Software Engineer at HashCash Consultants LLC. Success is a visitor emailing him, using the contact form, or downloading the résumé in one visit.

## Positioning
The site demonstrates the skill it advertises: its own assistant answers questions about Saif with retrieval-augmented generation over his CV and case studies, streams the answer and cites numbered sources. Behind it is production work a neighbouring engineer cannot claim: a multi-tenant RAG platform and a read-only MCP knowledge server at HashCash, real-time messaging/calling (Socket.IO, WebRTC, LiveKit), and shipped personal projects with measured numbers.

## Operating Context
- Based in Durgapur, West Bengal, India (IST, UTC+5:30); open to remote work or relocation.
- Visitors arrive from LinkedIn, a job application or a shared link, often on a phone.
- Pages: home (about, experience, platforms, projects, capabilities, telemetry, contact; writing in dev only), `/projects/[slug]` case studies, `/blog`, `/privacy`, `/resume.pdf`.

## Capabilities and Constraints
- Next.js 16 App Router, React 19, Tailwind v4, TypeScript; content in `content/` (`profile.ts`, `posts.ts`, MDX). Changing content requires `pnpm ingest` and committing `lib/rag/index.json`.
- Ask-my-AI chat (`/api/chat`, Gemini flash-lite, Upstash rate limits, cited sources), Ctrl+K command palette, anonymous visitor telemetry with a world map, Resend contact form, light/dark theme.
- WCAG 2.2 AA in both themes (axe in E2E); Lighthouse targets ≥95; initial JS ≤200 KB gz.
- HashCash product names are withheld under company policy. HRMS, real-time platform and all platform case studies are hidden drafts until Saif confirms the facts.

## Brand Commitments
- Name is written "Md. Saif Ali". Voice: first person, plain, specific, measured numbers over adjectives.
- Must not look like a generic developer template or feel corporate/stiff (Saif, 2026-10-16).
- Must stay visibly distinct from a colleague's green terminal-style portfolio.

## Evidence on Hand
- Metrics in `content/profile.ts`: ~30% less manual retrieval (RAG platform), p95 REST latency −20%, 6+ microservices, ~60% less manual release effort, 80%+ coverage, ~40% faster page loads; InsightFlow p95 368–377 ms, 1M rows in ~12 s, 189 tests.
- Screenshots: `public/projects/insightflow.jpg`, `public/projects/mock-interview-ai.jpg`. Résumé: `public/MD. SAIF ALI_RESUME.pdf` (previous version: `public/resume.pdf`).
- Portrait: Saif will provide `public/me.jpg` (not yet present).
- Absent, never to be fabricated: testimonials, employer logos, client names, press, follower counts.

## Product Principles
- Prove, don't claim: every claim on the page points at a number, a live project, a source or the working assistant.
- The recruiter's ten seconds come first: who, what, available, how to contact.
- The assistant is the signature, not a gimmick: it answers from real content and admits when it does not know.
- Honest about drafts: unconfirmed work stays hidden rather than padded.

## Accessibility & Inclusion
WCAG 2.2 AA in light and dark, keyboard-operable chat and palette, visible focus, reduced-motion respected, 16px inputs on touch screens.
