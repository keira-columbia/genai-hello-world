create table if not exists public.countries (
  country text primary key,
  capital text not null,
  area_sq_km bigint not null
);

alter table public.countries enable row level security;

revoke all on public.countries from anon, authenticated;
grant select on public.countries to anon, authenticated;

create policy "Anyone can read countries"
on public.countries
for select
to anon, authenticated
using (true);

insert into public.countries (country, capital, area_sq_km) values
  ('Russia', 'Moscow', 17075200),
  ('Canada', 'Ottawa', 9984670),
  ('United States', 'Washington, D.C.', 9826630),
  ('China', 'Beijing', 9596960),
  ('Brazil', 'Brasília', 8511965)
on conflict (country) do update set
  capital = excluded.capital,
  area_sq_km = excluded.area_sq_km;
