create table if not exists public.moment_ratings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  moment_id uuid not null references public.moments(id) on delete cascade,
  value smallint not null check (value in (-1, 1)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, moment_id)
);

alter table public.moment_ratings enable row level security;
revoke all on public.moment_ratings from anon, authenticated;
grant select on public.moment_ratings to anon, authenticated;
grant insert, update on public.moment_ratings to authenticated;

drop policy if exists "Ratings are publicly readable" on public.moment_ratings;
create policy "Ratings are publicly readable"
on public.moment_ratings for select to anon, authenticated using (true);

drop policy if exists "Users create their own ratings" on public.moment_ratings;
create policy "Users create their own ratings"
on public.moment_ratings for insert to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users update their own ratings" on public.moment_ratings;
create policy "Users update their own ratings"
on public.moment_ratings for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

