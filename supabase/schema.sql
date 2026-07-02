-- =============================================================
--  Shepherd MPP — Supabase schema
--  Run this in the Supabase SQL editor (Project → SQL → New query).
--  Project: eudlchetivtqemnhixgf. Run one block at a time.
-- =============================================================

create extension if not exists "uuid-ossp";

create table athletes (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  full_name text not null,
  team_name text,
  created_at timestamp with time zone default now()
);

create table mpp_responses (
  id uuid default uuid_generate_v4() primary key,
  athlete_id uuid references athletes(id) on delete cascade,
  protocol_number integer not null,
  protocol_slug text not null,
  responses jsonb not null default '{}',
  completed_at timestamp with time zone default now()
);

create index athletes_email_idx on athletes(email);
create index mpp_responses_athlete_id_idx on mpp_responses(athlete_id);

alter table athletes enable row level security;
alter table mpp_responses enable row level security;

create policy "service role only" on athletes using (false);
create policy "service role only" on mpp_responses using (false);
