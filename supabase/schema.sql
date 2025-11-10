-- NightNode core schema ----------------------------------------------------
create table if not exists public.cities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  state text not null,
  latitude double precision not null,
  longitude double precision not null,
  timezone text not null,
  created_at timestamptz default now()
);

create table if not exists public.venues (
  id uuid primary key default gen_random_uuid(),
  city_id uuid references public.cities (id) on delete cascade,
  created_by uuid references auth.users (id),
  slug text unique not null,
  name text not null,
  latitude double precision not null,
  longitude double precision not null,
  vibe_tags text[] default '{}',
  music_tags text[] default '{}',
  price_tier text default 'Medium',
  wait_minutes int,
  busyness_score int default 0,
  busyness_label text default 'Quiet',
  busyness_trend text default 'steady',
  line_estimate text,
  status text default 'open',
  crowd_ratio_men int default 50,
  crowd_ratio_women int default 50,
  crowd_ratio_label text default '50:50',
  verification_score int default 0,
  verification_streak int default 0,
  cover_amount numeric,
  cover_currency text default 'USD',
  cover_note text,
  entry_age text default '21+',
  dress_code text default 'Casual',
  id_required boolean default true,
  hero_image text,
  cover_image text,
  transit_notes text,
  safety_notes text[] default '{}',
  safety_flags text[] default '{}',
  last_call text,
  promo_text text,
  open_hours jsonb,
  weekly_history jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.venue_reports (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid references public.venues (id) on delete cascade,
  wait_minutes int not null,
  line_length text not null,
  vibe text,
  note text,
  busyness_score int,
  ratio_men int,
  ratio_women int,
  cover_amount numeric,
  submitted_by uuid references auth.users (id),
  confidence numeric default 0.5,
  verified boolean default false,
  submitted_at timestamptz default now()
);

create table if not exists public.venue_alert_subscriptions (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid references public.venues (id) on delete cascade,
  profile_id uuid references auth.users (id),
  alert_type text not null,
  enabled boolean default true,
  created_at timestamptz default now()
);

-- Row level security -------------------------------------------------------
alter table public.venues enable row level security;
alter table public.venue_reports enable row level security;
alter table public.venue_alert_subscriptions enable row level security;

create policy "public_read_venues" on public.venues for select using (true);
create policy "venue_staff_update" on public.venues
  for update
  using (auth.uid() = created_by)
  with check (auth.uid() = created_by);

create policy "crowd_reports_insert" on public.venue_reports
  for insert
  with check (true);

create policy "crowd_reports_read" on public.venue_reports
  for select using (true);

create policy "alert_subscriptions_self" on public.venue_alert_subscriptions
  for all
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

-- Helper view to join rollups ------------------------------------------------
create or replace view public.venue_status_view as
select
  v.*,
  coalesce(avg(r.wait_minutes) filter (where r.submitted_at > now() - interval '2 hours'), v.wait_minutes) as blended_wait,
  json_agg(r order by r.submitted_at desc) filter (where r.id is not null) as recent_reports
from public.venues v
left join public.venue_reports r on r.venue_id = v.id
group by v.id;
