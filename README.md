# Reading List

A Next.js page that lists books from Supabase.

## Supabase setup

1. Create a Supabase project.
2. Run `supabase/books.sql` in the project's SQL Editor to create and populate the `books` table.
3. Copy `.env.example` to `.env.local` and set the project URL and anon (or publishable) key from Supabase's Connect dialog.
4. Add the same environment variables to the Vercel project for Production.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 to view the app.
