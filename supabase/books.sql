create table public.books (
  id bigint generated always as identity primary key,
  title text not null,
  author text not null
);

alter table public.books enable row level security;

revoke all on public.books from anon, authenticated;
grant select on public.books to anon, authenticated;

create policy "Anyone can read books"
on public.books
for select
to anon, authenticated
using (true);

insert into public.books (title, author) values
  ('Pride and Prejudice', 'Jane Austen'),
  ('The Great Gatsby', 'F. Scott Fitzgerald'),
  ('Beloved', 'Toni Morrison');
