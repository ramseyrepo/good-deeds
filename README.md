# Ulu

Post volunteering events and **track participation** — hours and deeds that add up to a
personal impact record. Built on the Souped stack (Next.js 16, React 19, Prisma 7,
Tailwind 4, shadcn/ui, Souped auth).

> Strategic context lives in the Souped project brief (business-idea game) and in
> `docs/design/design-contract.md`. Brand is **provisional** — the brand-studio game
> has no decisions yet, so revisit colors/name/voice after playing it.

## What's here

- **Public landing** (`/`) — mission + CTAs.
- **Dashboard** (`/app`) — the **Impact Ledger** (hours, deeds, upcoming) + your deeds + open events.
- **Browse** (`/app/events`) — all open volunteering events.
- **Event detail** (`/app/events/[id]`) — join / leave, and **log hours** (participation tracking).
- **Post a deed** (`/app/events/new`) — organizers create events.
- **Auth** — Souped OAuth; DB-backed `User` with lazy sync (`src/lib/auth.ts`). `/app/*` is gated by `src/proxy.ts`.

Data model (`prisma/schema.prisma`): `User`, `Event`, `Participation` (+ boilerplate notifications).

## Run it locally

Requires Node ≥22, pnpm ≥10, and a Postgres database. (These steps need open network —
they download the Prisma engine and Google Fonts, which a restricted sandbox blocks.)

```bash
pnpm install
cp .env.example .env.local          # then fill the values below
pnpm prisma migrate dev --name init # creates the tables
pnpm dev                            # http://localhost:3000
```

### Environment (`.env.local`)

- `DATABASE_URL` — your Postgres connection string.
- `SOUPED_URL`, `SOUPED_CLIENT_ID`, `SOUPED_CLIENT_SECRET`, `SOUPED_APP_ID`,
  `SOUPED_AUDIENCE`, `SOUPED_ISSUER`, `SOUPED_SESSION_SECRET` — from the Souped
  dashboard or `glaze_get_project_auth_setup` (MCP). The Souped project already
  exists: **Ulu** (`pj-damp-yew-qei4up`).

## Deploy later (via /souped)

This was a build-only session. To ship: push to GitHub, create the Vercel project +
database through Spark, set env vars, enable auth on the Souped project
(`glaze_enable_project_auth`) and add redirect URIs, then deploy. The `/souped`
orchestrator automates this.
