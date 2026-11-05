-- Inganathi Driving Academy dashboard: additive schema for learner access and test results.
-- Review and run in Supabase SQL Editor. Does not alter the existing profiles table.
create extension if not exists pgcrypto;

create table if not exists public.learner_access (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  starts_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '21 days'),
  disabled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint learner_access_valid_window check (expires_at > starts_at)
);

create table if not exists public.test_results (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references public.profiles(id) on delete cascade,
  test_key text not null,
  test_title text not null,
  score integer not null check (score >= 0),
  total_questions integer not null check (total_questions > 0),
  answers jsonb not null default '[]'::jsonb,
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint test_result_score_valid check (score <= total_questions)
);

create index if not exists test_results_learner_completed_idx
  on public.test_results (learner_id, completed_at desc);
create index if not exists learner_access_expiry_idx
  on public.learner_access (expires_at);

alter table public.learner_access enable row level security;
alter table public.test_results enable row level security;

drop policy if exists "Learners read own access or admins read all" on public.learner_access;
create policy "Learners read own access or admins read all"
on public.learner_access for select to authenticated
using (user_id = auth.uid() or public.is_academy_admin());

drop policy if exists "Admins manage learner access" on public.learner_access;
create policy "Admins manage learner access"
on public.learner_access for all to authenticated
using (public.is_academy_admin())
with check (public.is_academy_admin());

drop policy if exists "Learners read own results or admins read all" on public.test_results;
create policy "Learners read own results or admins read all"
on public.test_results for select to authenticated
using (learner_id = auth.uid() or public.is_academy_admin());

drop policy if exists "Learners insert own results while access active" on public.test_results;
create policy "Learners insert own results while access active"
on public.test_results for insert to authenticated
with check (
  learner_id = auth.uid()
  and exists (
    select 1 from public.learner_access a
    where a.user_id = auth.uid()
      and a.disabled_at is null
      and a.starts_at <= now()
      and a.expires_at > now()
  )
);

-- Admin may add/extend access using authenticated dashboard operations.
-- Result deletion is intentionally not automated by this SQL; configure a reviewed
-- scheduled cleanup only after retention rules and backups are agreed.
