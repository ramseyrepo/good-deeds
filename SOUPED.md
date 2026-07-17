# SOUPED.md

This file tracks every decision made on this project regarding the Souped suite — any tool, skill, or agent under the `souped` plugin (auth, design, Chalk, Carte, Spark, Shelf, Fond, and anything added later).

## USE IT AS A GUIDE, NOT AS GROUND TRUTH

It speeds up agents by pointing at what was done previously and where to look. But it can drift: someone may have changed signup restrictions, added a Chalk table, or rotated a Vercel domain outside of the orchestrator's flow.

**Rules for ANY agent or skill in the `souped` plugin:**

1. **Read this file at the start of every session** for orientation about prior decisions.
2. **Before acting on a specific value, verify it against the real source** — the appropriate Souped MCP tool, the codebase, or the database. Example: if a recent entry says signup restriction is `open` and you need that value to do something, call the Glaze MCP and confirm. **Do not assume.**
3. **If verification reveals a mismatch:** corroborate the new value with a second source so you're confident it's real, then append a `drift detected` entry to the log (see format below) **in the same change as your action**.
4. **After ANY Souped operation, append one entry to the Decisions log below.** This is the only structured place you record what happened — there are no per-subsystem sections to fill in. The log itself is the project's memory.

---

## Project meta

- **Name:** Good Deeds
- **SOUPED.md created on:** 2026-07-16
- **Repo URL:** _not pushed yet — build-only session; deploy later_
- **Souped project ID:** 88e0dcb5-f26c-496d-9382-9669e106a165 (slug pj-damp-yew-qei4up)
- **Workspace slug:** ws-zero-moss-MQIAbY (Ramseyross's Workspace)

Anything else (Vercel project, primary domain, current auth scope, registered Chalk tables, Carte pages, Shelf buckets, design contract location, env-var names, etc.) lives in the Decisions log. Don't carve out subsystem sections here — let the log be the single timeline.

---

## Decisions log

Append-only. Newest entries at the bottom. One entry per Souped operation.

**Format:**

```
YYYY-MM-DD — <tool-or-subsystem> — <short title>
<1–3 sentences explaining what happened and why. Mention values an agent might
want to verify later (route patterns, table names, role names, domain, env
var names — never values).>
```

**Examples** (illustrative — replace with real entries as the project evolves):

```
2026-06-19 — scaffolder — initial scaffold
Cloned from souped-boilerplate. Stack: Next.js 16 + Prisma 7 + Souped auth.

2026-06-19 — souped-mcp — Souped project created
Project ID abc123 in workspace acme. Audience: webapp:abc123.

2026-06-19 — auth-scaffolder — DB-backed users wired
auth_scope=global (matcher unchanged). Added Prisma User model with roles
enum [admin, member]. requireRole helper in src/lib/auth.ts.

2026-06-19 — chalk — registered 'faqs' table
Collection of FAQ items. Consumed by /about page (FaqList component).
Editable from Souped → Chalk.

2026-06-19 — carte — registered '/' SEO entry
Public landing. Robots: index. OG image at /og/landing.png.

2026-06-19 — spark — first deploy
Vercel project: acme-app. URL: https://acme-app.vercel.app. Env vars set:
DATABASE_URL, SOUPED_CLIENT_ID, SOUPED_CLIENT_SECRET, SOUPED_SESSION_SECRET.

2026-06-19 — drift detected — signup restriction
SOUPED.md log implied 'open' (no prior entry stating otherwise). Glaze MCP
returned 'domain-allowlist' (acme.com). Confirmed via dashboard. Logging
correction so future sessions see the current state.
```

### Entries

- 2026-07-16 — meta — SOUPED.md initialized from boilerplate.
- 2026-07-16 — scaffolder — initial scaffold. Cloned souped-boilerplate (Next.js 16 + React 19 + Prisma 7 + Tailwind 4 + Souped auth). Personalized as "good-deeds". Built LOCALLY only (no GitHub push, no Vercel) — user chose "build only, deploy later". `gh` not available in this environment.
- 2026-07-16 — fond — loaded project brief. business-idea game decisions used as ground truth: problem (help/connection), solution (Good Deeds — post volunteering events, track participation), beachhead (non-profits > unemployed > schools), core user (student building a "life résumé"), MVP scope (keep: core actions, dashboard, mobile; cut: auth, search), data-model seed (Projects: time/date, activity type, participation). brand-studio game had ZERO decisions — brand is PROVISIONAL.
- 2026-07-16 — design — wrote docs/design/design-contract.md. Proposed brand (provisional): warm civic "growth" direction — sprout green primary + amber accent on warm paper; Fraunces headings / DM Sans body / JetBrains Mono for numerals. frontend-design direction: warm-editorial. The unforgettable thing: "Impact Ledger" (personal hours+deeds growth bar). Tokens set in src/app/globals.css. Favicon replaced (sprout monogram) — no longer the Souped placeholder. NOTE: brand needs revisit once brand-studio game is played.
- 2026-07-16 — build — Good Deeds feature. Prisma models: User, Event, Participation (unique [eventId,userId]); kept boilerplate Notification + souped_notification_workflow_config. Server actions in src/actions/events.ts: createEvent, joinEvent, leaveEvent, logAttendance (participation tracking = the differentiator). Pages: / (public landing), /app (dashboard w/ Impact Ledger), /app/events, /app/events/[id], /app/events/new. All /app pages force-dynamic.
- 2026-07-16 — auth — user OVERRODE the MVP "cut auth" decision and chose to include login. Boilerplate Souped auth kept; added DB-backed User + lazy-sync (getCurrentUser/requireUser upsert by JWT sub) in src/lib/auth.ts. auth_scope stays global (boilerplate default: matcher wide, publicRoutes ["/"]). NOT YET wired to a live Souped project (auth disabled on project; SOUPED_* env vars unset) — do this at deploy time: set SOUPED_* env, run glaze_enable_project_auth, add redirect URIs.
- 2026-07-16 — verify — ESLint clean; TypeScript clean except Prisma-inferred callback params (resolve once `prisma generate` runs). Full `pnpm build` + `prisma migrate` NOT run here: sandbox network blocks Prisma engine + Google Fonts downloads. Must run on a machine/CI with open network.
- 2026-07-16 — spark — GitHub repo linked. ramseyrepo/good-deeds linked to Souped project via spark_link_github.
- 2026-07-16 — spark — Vercel project + database. Created Vercel project "good-deeds" (prj_UVXpBMQYBNKMOWw4tcJt1l2x7hyY) on subdomain good-deeds.getsouped.app; provisioned Neon DB. Env vars set: DATABASE_URL, NEXT_PUBLIC_APP_URL, SOUPED_CLIENT_ID/SECRET/URL/APP_ID/AUDIENCE/ISSUER, SOUPED_SESSION_SECRET. Build runs `prisma db push && next build` (schema created on deploy).
- 2026-07-16 — glaze — auth enabled. glaze_enable_project_auth=true (default method OTP/email). Redirect URI: https://good-deeds.getsouped.app/api/auth/callback.
- 2026-07-16 — spark — first production deploy. dpl_qWLUEL9wQXB2Gpvgy9ngWTbizUgf READY. Build passed (Prisma client generated, db push synced, next build + TypeScript OK). Live at https://good-deeds.getsouped.app. (First attempt failed on an invalid `--skip-generate` flag; fixed.)
