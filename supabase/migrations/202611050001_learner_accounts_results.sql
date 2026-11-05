-- Inganathi K53 learner accounts and results foundation
-- Apply in Supabase SQL Editor after reviewing. Do not put secrets in this file.
-- Admin account bootstrap: set profiles.role='admin' only for trusted academy staff.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  full_name text not null,
  role text not null default 'learner' check (role in ('admin','learner')),
  is_active boolean not null default true,
  access_expires_at timestamptz not null default (now() + interval '21 days'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.test_attempts (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references public.profiles(id) on delete cascade,
  test_key text not null,
  test_title text not null,
  score integer not null default 0 check (score >= 0),
  total_questions integer not null check (total_questions > 0),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  answers jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  constraint score_not_over_total check (score <= total_questions)
);

create index if not exists test_attempts_learner_completed_idx
  on public.test_attempts (learner_id, completed_at desc);

create or replace function public.is_academy_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin' and p.is_active = true
  );
$$;

alter table public.profiles enable row level security;
alter table public.test_attempts enable row level security;

drop policy if exists "Learners read own profile or admin reads all" on public.profiles;
create policy "Learners read own profile or admin reads all"
  on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_academy_admin());

drop policy if exists "Admins update learner profiles" on public.profiles;
create policy "Admins update learner profiles"
  on public.profiles for update to authenticated
  using (public.is_academy_admin())
  with check (public.is_academy_admin());

drop policy if exists "Learners read own attempts or admin reads all" on public.test_attempts;
create policy "Learners read own attempts or admin reads all"
  on public.test_attempts for select to authenticated
  using (learner_id = auth.uid() or public.is_academy_admin());

drop policy if exists "Active learners submit own attempts" on public.test_attempts;
create policy "Active learners submit own attempts"
  on public.test_attempts for insert to authenticated
  with check (
    learner_id = auth.uid()
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role = 'learner'
        and p.is_active = true
        and p.access_expires_at > now()
    )
  );

-- Learners cannot alter their own profile/access role or update submitted results.
-- Admin account creation and learner account provisioning must use a trusted server-side
-- function (Edge Function) with the service-role secret stored only in Supabase secrets.
