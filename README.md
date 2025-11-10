# NightNode

A real-time nightlife companion built with **Next.js (App Router) + TypeScript + Tailwind v4**, **Supabase (Postgres/Auth/Storage/RLS)**, and **Mapbox GL**. Track live wait times, busyness heatmaps, entry rules, safety intel, and push alerts so crews pick the right venue faster while venues broadcast verified updates.

https://github.com/user-attachments/assets/placeholder

## Highlights

- **Live venue pulse** – crowd-sourced waits blended with venue updates, trust scores, and Mapbox heatmaps.
- **Dual map/list surfaces** – filter by city, vibe, music, or price; swipe-friendly cards double as lightweight dashboards.
- **Push-ready alert center** – “line just dropped”, “approaching capacity”, “no cover for 20 min”, plus safety & transit nudges.
- **Crowd report + verification loop** – 2-tap “How long did you wait?” with cooldown, trust streaks, and anomaly hints.
- **Venue portal slice** – nano-dashboard lets staff adjust waits, cover, promos, and status with server actions wired to Supabase.
- **Safety + ops rails** – city data for transit/flags, Slack-ready analytics hints, and SQL schema with RLS policies.

## Tech Stack

| Layer | Details |
| --- | --- |
| Frontend | Next.js 16 (App Router), React 19 + React Compiler, Tailwind CSS v4, React Query, Lucide icons |
| Maps | Mapbox GL via `react-map-gl` + heatmap/circle layers |
| Backend | Supabase Postgres/Auth/Storage/RLS, live channels for venue updates, server actions for mutations |
| Data | Type-safe models, fallback mock data for local dev, SQL schema + policies in `supabase/schema.sql` |

## Quick Start

```bash
npm install
cp .env.example .env.local   # add Supabase + Mapbox keys
npm run dev                  # http://localhost:3000
```

### Required environment variables (`.env.local`)

```bash
NEXT_PUBLIC_SUPABASE_URL="https://<project>.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<anon-key>"
SUPABASE_SERVICE_ROLE_KEY="<service-role-for-server-actions>"
NEXT_PUBLIC_MAPBOX_TOKEN="pk.ey..."
```

Without Supabase/Mapbox keys the UI gracefully falls back to mocked venues and shows a CTA on the map card.

## Supabase schema & policies

`supabase/schema.sql` seeds the core objects:

- `cities` – rollout tracker + safety metadata
- `venues` – coordinates, vibe tags, pricing, wait/busyness, promos, images, safety flags (RLS scoped to venue staff)
- `venue_reports` – crowd-sourced waits/notes with confidence + verification (public insert/select)
- `venue_alert_subscriptions` – per-user alert toggles (self-managed RLS)
- `venue_status_view` – helper view blending live waits + recent reports for smoother analytics

RLS cheatsheet:

- `public_read_venues` grants read-only access to everyone.
- `venue_staff_update` lets venue owners update their row when `created_by = auth.uid()`.
- `crowd_reports_insert` + `crowd_reports_read` manage public reporting loop.
- `alert_subscriptions_self` locks alert toggles to the current profile.

Run the script with `supabase db push` or copy into the SQL editor.

## Feature map

- **City selector + filters** – college/dense city presets with vibe/music/price filter groups.
- **Heatmap/list** – Mapbox GL heatmap + markers next to stacked venue cards (cover, rules, specials, trust streaks).
- **Push alert manager** – toggles for line drops, capacity, no-cover, safety/transit alerts.
- **Crowd reporter** – slider + chips to submit wait/line/vibe + note; wired to Supabase server action.
- **Venue dashboard slice** – staff side form to push wait/busyness/cover promos through Supabase.
- **Safety rail** – transit notes, city flags, last call intel for each rollout market.
- **Analytics highlights** – avg wait, live venue count, “heat check” hero with trend text.

## Next steps / roadmap

1. **Mobile auth loop** – Supabase Auth (OTP + social) + trust score gating for high-impact reports.
2. **Realtime Webhooks** – Edge Functions to fan out push notifications + anomaly detection on noisy submissions.
3. **Venue analytics** – conversion funnels (map/list → in-venue), time-of-night heatmaps, exportable CSV summaries.
4. **Loyalty/perks** – stamp-based perks, queue tickets, and friend location opt-ins (Phase 2 items from brief).
5. **Moderation tooling** – rate limiting, streak weighting, auto-flagged photo snippets routed to human review.

## Project structure

```
src/
  app/
    actions/          # Server actions hitting Supabase
    layout.tsx        # Global providers (React Query) + fonts
    page.tsx          # Server entry, fetch initial venues
  components/
    home/             # Feature cards (map, filters, alerts, dashboard, etc.)
    map/              # Mapbox wrapper
    providers/        # React Query provider
  lib/
    constants.ts      # City/filter presets + alert templates
    data/mockVenues.ts
    hooks/use-venues.ts
    services/venue-service.ts
    supabase/         # Client/server helpers + typed schema
    types.ts & utils.ts
supabase/schema.sql    # Postgres + RLS definition
```

## Testing & verification

- `npm run lint` – Next/ESLint config for type-safe App Router code.
- Manual smoke test: `npm run dev`, toggle cities/filters, submit crowd report, push venue update, and check Mapbox fallback messaging without a token.

## Share-ready blurb

> NightNode is a real-time nightlife companion: live heatmaps, cover + safety alerts, and lightweight venue dashboards so people choose the right spot faster. Built on Next.js + Supabase with RLS-first design and ready for partner/investor one-pagers.
