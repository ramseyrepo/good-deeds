# Good Deeds — Design Contract

> Source of truth for all UI. Derived from the project's game brief (business-idea)
> plus a proposed brand direction (brand-studio game not yet played — brand is
> provisional and may be revised later). Auth: enabled (user override of MVP "cut auth").

## 0. Brand profile (provisional — no brand-studio decisions yet)

- **Product:** Good Deeds — post volunteering events and *track participation*.
- **Positioning:** "Show up. Log it. Watch your good grow." A warm, community-first
  way to find local volunteering and keep a running record of the good you've done.
- **Audience:** non-profits (post events) → volunteers, incl. students building a
  "life résumé." Warm, encouraging, never guilt-tripping.
- **Differentiator:** participation tracking — hours + attendance become a personal
  impact record, not just an event feed (unlike a Facebook event).

### The unforgettable thing
**The Impact Ledger** — a personal, growing tally of hours + deeds rendered as a
warm stacked "growth bar" with a sprout motif. It's the first thing a volunteer sees
on their dashboard and the reason to come back: their good, made visible and countable.

## 1. Design tokens

Colors chosen for a civic/hopeful/warm feel (growth green + optimistic amber on warm
off-white). Max 8 colors. No purple-by-reflex, no Inter+rounded+soft-shadow default.
All app-shell UI uses the shadcn token slots; values below are set in `globals.css`.

Light theme (oklch):
- `--background`  oklch(0.99 0.008 95)   # warm off-white   (from §Brand: warm paper)
- `--foreground`  oklch(0.24 0.02 150)    # deep evergreen ink
- `--primary`     oklch(0.55 0.11 155)    # sprout green — primary action/brand
- `--primary-foreground` oklch(0.99 0.01 95)
- `--secondary`   oklch(0.95 0.02 95)     # warm sand
- `--accent`      oklch(0.80 0.14 80)     # amber highlight (impact, streaks)
- `--muted`       oklch(0.95 0.01 120)
- `--muted-foreground` oklch(0.50 0.02 150)
- `--destructive` oklch(0.58 0.22 25)     # leave/cancel
- `--border`      oklch(0.90 0.01 120)
- `--radius`      0.75rem                  # friendly but not pill-round

Brand surface tokens (landing / hero), set as `--gd-*`:
- `--gd-forest` #1f4d3a  (deep green ground)
- `--gd-sprout` #2f9e6f  (action green)
- `--gd-amber`  #e8a838  (impact accent)
- `--gd-paper`  #faf7f0  (warm paper)
- `--gd-ink`    #16281f  (near-black green)

Typography (max 3 families):
- **Fraunces** (serif, warm, human) — headings / hero. `--font-heading`.
- **DM Sans** — body + UI (already loaded by boilerplate). `--font-sans`.
- **JetBrains Mono** — numbers/data: hours, counts on the Impact Ledger. `--font-mono`.
- Legibility/dyslexia: body ≥16px, line-height ≥1.5, no justified text, numerals in
  mono for scannability.

Motion tiers:
- Tier 1 (feedback): button press, join/leave toast — 120ms ease.
- Tier 2 (entrance): Impact Ledger bar fills from 0 on dashboard load — 700ms ease-out.
- Reduced-motion: honor `prefers-reduced-motion` — ledger appears filled, no animation.

## 2. Component inventory
- shadcn: Button, Card, Badge, Input, Label, Popover, Dropdown, Sonner (toasts).
- Custom: `ImpactLedger` (the unforgettable thing), `EventCard`, `ParticipationBadge`,
  `StatTile`, `SiteNav`, `EmptyState`, `JoinButton` (server-action bound).

## 3. Product tree (routes)
- `/`                    public landing (marketing) — mission + CTA. In Carte later.
- `/app`                 dashboard — Impact Ledger + your upcoming deeds + open events.
- `/app/events`          browse all open volunteering events.
- `/app/events/[id]`     event detail — join / leave / mark attended / log hours.
- `/app/events/new`      create an event (organizers / non-profits).
- `/api/auth/*`          Souped auth (public).
- `/app/*`               gated by `src/proxy.ts` (session required), noindex.

## 4. Responsive (breakpoints)
- Mobile (<640): single column, sticky bottom-safe CTA, ledger full-width on top.
- Tablet (640–1024): 2-col event grid, ledger spans top.
- Desktop (>1024): dashboard = ledger + upcoming (left, 1/3) and open events (2/3);
  events browse = 3-col grid; max content width 72rem, centered.

## 5. Interaction states (every interactive component)
- Button/JoinButton: default / hover / active / focus-visible (2px ring) / disabled /
  pending (spinner, "Joining…").
- EventCard: default / hover (lift + border-primary) / focus-within.
- Inputs: default / focus (ring) / error (destructive border + message) / disabled.
- Join flow: not-joined → "Join this deed"; joined → "You're going" + "Leave";
  attended → "Attended · N hrs logged" (locked badge).
- Empty states: no events ("No open deeds yet — check back soon"); new user ledger
  ("Your ledger is empty. Join your first deed to start your record.").

## 6. Copy (real, not lorem)
- Hero H1: "Do good. Keep the receipts."
- Hero sub: "Find volunteering near you, show up, and build a record of your impact —
  hours and deeds that add up."
- Primary CTA: "Find a deed" → /app
- Dashboard heading: "Your impact"
- Ledger labels: "Hours logged", "Deeds done", "Events upcoming"
- Join CTA: "Join this deed" / pending "Joining…" / done "You're going"
- Log hours: "Log your hours" → toast "Nice work — 3 hours added to your ledger."
- Create event CTA: "Post a deed"

## 7. Themes
- Light (default), warm. Dark variant deferred (provisional brand); tokens present in
  globals.css `.dark` retained from boilerplate but not brand-tuned yet — flagged.

## 8. Visual asset system
- Favicon: sprout monogram (green leaf "g") replacing the Souped placeholder.
- Iconography: lucide-react (already a dep) — hand-heart, sprout, calendar, clock,
  map-pin, users.
- Imagery: illustration-light; no stock-photo dependency for MVP.

## 9. Accessibility
- WCAG AA target. Primary green (#2f9e6f) on paper (#faf7f0): AA for large/UI; body
  text uses foreground ink (contrast > 7:1). Amber used only for accents/large, never
  small body text on paper (fails AA at small sizes — audited, restricted to ≥18px/UI).
- Colorblind: deuteranopia/protanopia — status never encoded by color alone (Join/going/
  attended also differ by label + icon). Tritanopia — amber vs green distinguishable by
  shape/label.
- Focus-visible rings on all interactive elements; keyboard operable; form labels bound.
- prefers-reduced-motion respected on the ledger animation.

## Notes / open items
- Brand is PROVISIONAL: no brand-studio decisions exist yet. Revisit color/name/voice
  after that game is played. Logged in SOUPED.md.
- Dark theme not brand-tuned (deferred).
