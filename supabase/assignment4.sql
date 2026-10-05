create extension if not exists pgcrypto;

-- Existing Assignment 2 and 3 tables
alter table if exists public.countries enable row level security;
alter table if exists public.books enable row level security;
alter table public.profiles enable row level security;
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to anon, authenticated;
grant update on public.profiles to authenticated;
drop policy if exists "Profiles are publicly readable" on public.profiles;
create policy "Profiles are publicly readable" on public.profiles for select to anon, authenticated using (true);
drop policy if exists "Users update their own profile" on public.profiles;
create policy "Users update their own profile" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- AI media and rating tables
create table if not exists public.moments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 70),
  zone text not null check (zone in ('Library','Dorms','Dining','Classroom','Subway','City','Other')),
  context text check (context is null or char_length(context) <= 280),
  image_path text not null unique,
  image_url text not null,
  image_description text not null,
  description_prompt text not null,
  description_model text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.captions (
  id uuid primary key default gen_random_uuid(),
  moment_id uuid not null references public.moments(id) on delete cascade,
  creator_id uuid not null references public.profiles(id) on delete cascade,
  caption_text text not null check (char_length(caption_text) between 1 and 240),
  generation_prompt text not null,
  generation_model text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.caption_votes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  moment_id uuid not null references public.moments(id) on delete cascade,
  caption_id uuid not null references public.captions(id) on delete cascade,
  value smallint not null default 1 check (value = 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, moment_id)
);

alter table public.moments enable row level security;
alter table public.captions enable row level security;
alter table public.caption_votes enable row level security;
revoke all on public.moments, public.captions, public.caption_votes from anon, authenticated;
grant select on public.moments, public.captions, public.caption_votes to anon, authenticated;
grant insert, delete on public.moments to authenticated;
grant insert on public.captions to authenticated;
grant insert, update on public.caption_votes to authenticated;

drop policy if exists "Moments are publicly readable" on public.moments;
create policy "Moments are publicly readable" on public.moments for select to anon, authenticated using (true);
drop policy if exists "Users create their own moments" on public.moments;
create policy "Users create their own moments" on public.moments for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "Users delete their own moments" on public.moments;
create policy "Users delete their own moments" on public.moments for delete to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "Captions are publicly readable" on public.captions;
create policy "Captions are publicly readable" on public.captions for select to anon, authenticated using (true);
drop policy if exists "Creators add captions to their own moments" on public.captions;
create policy "Creators add captions to their own moments" on public.captions for insert to authenticated with check (
  (select auth.uid()) = creator_id and exists (select 1 from public.moments where moments.id = captions.moment_id and moments.user_id = (select auth.uid()))
);

drop policy if exists "Votes are publicly readable" on public.caption_votes;
create policy "Votes are publicly readable" on public.caption_votes for select to anon, authenticated using (true);
drop policy if exists "Users cast their own valid votes" on public.caption_votes;
create policy "Users cast their own valid votes" on public.caption_votes for insert to authenticated with check (
  (select auth.uid()) = user_id and exists (select 1 from public.captions where captions.id = caption_votes.caption_id and captions.moment_id = caption_votes.moment_id)
);
drop policy if exists "Users change their own votes" on public.caption_votes;
create policy "Users change their own votes" on public.caption_votes for update to authenticated using ((select auth.uid()) = user_id) with check (
  (select auth.uid()) = user_id and exists (select 1 from public.captions where captions.id = caption_votes.caption_id and captions.moment_id = caption_votes.moment_id)
);

-- Public image buckets with owner-only writes
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('campus-moments', 'campus-moments', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Authenticated users upload campus moments" on storage.objects;
create policy "Authenticated users upload campus moments" on storage.objects for insert to authenticated with check (
  bucket_id = 'campus-moments' and (storage.foldername(name))[1] = (select auth.uid())::text
);
drop policy if exists "Users delete their own campus moments" on storage.objects;
create policy "Users delete their own campus moments" on storage.objects for delete to authenticated using (
  bucket_id = 'campus-moments' and (storage.foldername(name))[1] = (select auth.uid())::text
);
drop policy if exists "Users upload their own avatar" on storage.objects;
create policy "Users upload their own avatar" on storage.objects for insert to authenticated with check (
  bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text
);
drop policy if exists "Users update their own avatar" on storage.objects;
create policy "Users update their own avatar" on storage.objects for update to authenticated using (
  bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text
) with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
