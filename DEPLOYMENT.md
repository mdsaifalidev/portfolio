# Deployment guide (manual, Vercel)

Step-by-step instructions to put the portfolio live on Vercel's free Hobby plan at
`https://<your-project>.vercel.app`. Budget about 30–45 minutes the first time.

---

## 0. What you need

- A **GitHub** account (you have `mdsaifalidev`).
- A **Vercel** account — sign up at <https://vercel.com/signup> with GitHub.
- Access to **Google AI Studio** (Gemini key), **Upstash** (Redis) and **Resend** (email) — the same accounts used during development.
- This project on your machine with Node 24+ and pnpm 12.

---

## 1. Pre-flight checks (local)

Run these in the project folder. All of them must pass before you deploy.

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm exec tsx scripts/ingest.ts --check --strict   # assistant index must be up to date
pnpm build                                         # production build, same as Vercel runs
```

If the index check fails, run `pnpm ingest` (needs `GEMINI_API_KEY` in `.env.local`) and commit `lib/rag/index.json`.

Optional but recommended: `pnpm test:e2e` (builds and runs the browser + accessibility tests).

### Content checklist

- [ ] **Drafts.** Anything with `draft: true` in `content/profile.ts` or `content/posts.ts` is hidden on the live site. Publish only what you've reviewed: HRMS and Real-Time Communication platforms, the five work case studies, and the blog posts are still drafts with `TODO(Saif)` notes.
- [ ] **Headshot** (optional): add a square photo as `public/headshot.jpg` (≥ 800 px).
- [ ] **Résumé**: `public/resume.pdf` is the latest version.
- [ ] Remove or move `Md. Saif Ali - Portfolio.zip` out of the project folder — it is git-ignored, but don't upload it anywhere.

---

## 2. Fix your git identity (before the first push)

Every commit so far uses your **work** email (`mdsaif@hashcashconsultants.com`). For a public personal repo, switch to your personal email **before pushing anything**:

```bash
git config user.name "Md. Saif Ali"
git config user.email "saifmd9536@gmail.com"

# Rewrite the author on all existing commits (safe only because nothing has been pushed yet)
git rebase --root --exec "git commit --amend --no-edit --reset-author"

git log --format='%h %an <%ae>' | head   # verify: every line shows the personal email
```

> If you'd rather use GitHub's private no-reply address, use the one shown under GitHub → Settings → Emails instead of your Gmail.

---

## 3. Rotate the keys that were shared during development

The Gemini, Upstash and Resend keys were pasted into a chat while building the site. Create fresh ones for production and delete the old ones:

| Service | Where | What to do |
|---|---|---|
| Gemini | <https://aistudio.google.com/apikey> | Create a new API key; delete the old one. |
| Upstash Redis | <https://console.upstash.com> → your database → **REST API** | Reset/rotate the token; copy the new **UPSTASH_REDIS_REST_URL** and **UPSTASH_REDIS_REST_TOKEN**. |
| Resend | <https://resend.com/api-keys> | Create a new key with **Sending access**; delete the old one. |

Update your local `.env.local` with the new values too, so development keeps working.

Generate a new telemetry salt (any long random string), e.g.:

```bash
node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"
```

---

## 4. Push to GitHub

1. Create an **empty** repository on GitHub (e.g. `mdsaifalidev/portfolio`) — no README, no .gitignore, no licence.
2. Push:

```bash
git remote add origin https://github.com/mdsaifalidev/portfolio.git
git branch -M main
git push -u origin main
```

3. Confirm on GitHub that `.env.local` is **not** in the repository (it is git-ignored). Only `.env.example`, with blank values, should be there.

The CI workflow (`.github/workflows/ci.yml`) starts automatically on push: lint, typecheck, unit tests, build, browser + accessibility tests and Lighthouse. It needs no secrets.

---

## 5. Create the Vercel project

1. Vercel dashboard → **Add New… → Project** → **Import** your GitHub repository.
2. Settings on the import screen:
   - **Framework preset:** Next.js (auto-detected)
   - **Root directory:** `./`
   - **Build command / output / install command:** leave the defaults (Vercel detects pnpm from `pnpm-lock.yaml`; `pnpm build` also runs the assistant-index check).
3. Expand **Environment Variables** and add the values below (step 6) **before** clicking Deploy.
4. Click **Deploy**.

After the project exists, also set:

- **Settings → Build and Deployment → Node.js Version:** `24.x`.
- **Settings → Functions → Function Region:** `Mumbai, India (bom1)` — closest to you and to Gemini/Upstash latency from India. (Optional; the default works.)

---

## 6. Environment variables

Add each in **Project → Settings → Environment Variables**, environment **Production** (also tick **Preview** if you want preview deployments to have a working chatbot and contact form).

| Variable | Value | Required? |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://<your-project>.vercel.app` (no trailing slash) | Yes |
| `GEMINI_API_KEY` | new Gemini key | Yes (chatbot) |
| `GEMINI_CHAT_MODEL` | `gemini-3.5-flash-lite` | Optional (this is the default) |
| `GEMINI_THINKING_LEVEL` | `minimal` | Optional (default) |
| `CHAT_DAILY_BUDGET` | `300` | Optional (default) — max assistant answers per day site-wide |
| `UPSTASH_REDIS_REST_URL` | new Upstash REST URL | Yes (rate limits + telemetry) |
| `UPSTASH_REDIS_REST_TOKEN` | new Upstash REST token | Yes |
| `RESEND_API_KEY` | new Resend key | Yes (contact form) |
| `CONTACT_TO_EMAIL` | `saifmd9536@gmail.com` | Yes |
| `CONTACT_FROM_EMAIL` | `Portfolio <onboarding@resend.dev>` | Yes (until you verify a domain) |
| `TELEMETRY_SALT` | the random string from step 3 | Yes (visitor counts) |

**Do not add `EVAL_TOKEN`** in production — it only exists for the local evaluation script.

`NEXT_PUBLIC_SITE_URL` is baked in at build time: after changing it, **redeploy** (Deployments → ⋯ → Redeploy).

---

## 7. Turn on analytics

In the Vercel project:

1. **Analytics** tab → **Enable** (Web Analytics).
2. **Speed Insights** tab → **Enable**.

The site only loads these scripts when running on Vercel, so nothing else is needed.

---

## 8. Verify the live site

Open `https://<your-project>.vercel.app` and check:

- [ ] Home page loads in dark and light themes; the bottom status line jumps between sections.
- [ ] `Ctrl + K` opens the command menu.
- [ ] **Ask AI:** ask "Where does Saif work?" — the answer streams with numbered source links.
- [ ] **Contact form:** send yourself a test message; it arrives at `CONTACT_TO_EMAIL`.
- [ ] **Telemetry:** after visiting from a normal browser, the telemetry pane shows at least 1 visit (counts are cached for up to 60 s).
- [ ] `/projects/insightflow` and `/projects/portfolio-ai-assistant` load; draft case studies return 404.
- [ ] `/sitemap.xml`, `/robots.txt`, `/blog/rss.xml` and `/privacy` load and use your real URL.
- [ ] **Social preview:** paste the URL into the LinkedIn Post Inspector (<https://www.linkedin.com/post-inspector/>) — the amber preview card appears.
- [ ] **Search:** add the site in Google Search Console and submit `/sitemap.xml`.

---

## 9. Updating the site later

Every push to `main` deploys automatically.

```bash
# edit content in content/ …
pnpm ingest            # re-embed for the assistant (no-op if nothing changed)
pnpm lint && pnpm typecheck && pnpm test
git add -A && git commit -m "Update content"
git push
```

To publish a draft: fill in its `TODO(Saif)` notes, remove `draft: true` (and `caseStudy: { draft: true }` for platform write-ups), run `pnpm ingest`, commit and push.

**Rollback:** Vercel → Deployments → pick an earlier deployment → ⋯ → **Promote to Production** (instant).

---

## 10. Custom domain (later)

1. Buy a domain (e.g. `mdsaifali.dev`).
2. Vercel → Settings → **Domains** → add it and follow the DNS instructions.
3. Change `NEXT_PUBLIC_SITE_URL` to `https://mdsaifali.dev` and **redeploy**.
4. Resend → **Domains** → add and verify the domain, then set `CONTACT_FROM_EMAIL` to e.g. `Portfolio <hello@mdsaifali.dev>`.
5. Update the site URL in Google Search Console.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Build fails while installing dependencies (pnpm version) | Vercel's default pnpm differs from `packageManager` (pnpm 12) | Add env var `ENABLE_EXPERIMENTAL_COREPACK` = `1` and redeploy. |
| Build log warns "Assistant index is stale" | Content changed without `pnpm ingest` | Run `pnpm ingest` locally, commit `lib/rag/index.json`, push. |
| Chatbot says "unavailable right now" | `GEMINI_API_KEY` missing/invalid | Check the variable, then redeploy. |
| Chatbot says "busy, try again in a minute" or "daily limit" | Gemini free-tier quota (≈15 requests/min) or `CHAT_DAILY_BUDGET` reached | Wait, raise the budget, or enable billing on the Google AI project. |
| Contact form says the message couldn't be sent | Resend key wrong, or `CONTACT_TO_EMAIL` isn't the Resend account's email while no domain is verified | Check the key; without a verified domain Resend only delivers to the account owner's address. |
| Telemetry stays at 0 | Upstash variables missing, or visits only from bots/tools | Check the variables; visit from a normal browser; counts refresh within 60 s. |
| Social cards / sitemap show `mdsaifali.vercel.app` | `NEXT_PUBLIC_SITE_URL` not set or not redeployed | Set it and redeploy. |
| Analytics dashboard empty | Not enabled in Vercel | Step 7. |
