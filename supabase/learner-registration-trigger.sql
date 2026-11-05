-- Run once in the Supabase SQL Editor for learner self-registration.
-- New sign-ups are always learners; role is never accepted from browser metadata.
-- This trigger creates the matching academy profile and grants a 21-day access window.

create or replace function public.handle_new_inganathi_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  chosen_username text;
  chosen_name text;
begin
  chosen_username := lower(trim(coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1))));
  chosen_name := trim(coalesce(new.raw_user_meta_data ->> 'full_name', ''));

  if chosen_username is null or chosen_username = '' then
    chosen_username := 'learner_' || left(replace(new.id::text, '-', ''), 10);
  end if;
  if chosen_name = '' then
    chosen_name := 'Learner';
  end if;

  insert into public.profiles (
    id, username, full_name, role, is_active, access_expires_at
  )
  values (
    new.id, chosen_username, chosen_name, 'learner', true, now() + interval '21 days'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_inganathi on auth.users;
create trigger on_auth_user_created_inganathi
after insert on auth.users
for each row execute procedure public.handle_new_inganathi_user();

-- Ensure learner profiles can only be created by the trusted auth trigger/admin process.
-- Keep admin role assignment restricted to trusted SQL/admin operations.
