# Largest Countries by Area

A Next.js page that lists five countries, their capitals, and their areas from Supabase.
Area figures are from [Statistics Canada](https://www150.statcan.gc.ca/n1/pub/11-402-x/2009/4017_3119/tbl/cybac4017_3119_2009_000_t06-eng.htm).

## Supabase setup

1. Create a Supabase project.
2. Run `supabase/countries.sql` in the project's SQL Editor to create and populate the `countries` table.
3. Copy `.env.example` to `.env.local` and set the project URL and anon (or publishable) key from Supabase's Connect dialog.
4. Add the same environment variables to the Vercel project for Production.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 to view the app.
