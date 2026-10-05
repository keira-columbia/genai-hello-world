# Campus Survival Map

Campus Survival Map is a Next.js app for sharing the small disasters and victories of student life. Signed-in users upload a campus moment, Gemini describes the image and generates four caption choices, and the community votes for the caption that best belongs in the archive.

## Core flow

1. Anyone can browse the public survival map and open a field report.
2. Google authentication protects generation, voting, profiles, and the private activity record.
3. A signed-in user uploads an image with a location, context, and humor style.
4. Gemini first creates a factual visual description, then uses that description to write four captions.
5. The image, prompts, model names, description, and captions are saved in Supabase.
6. Each signed-in user can choose one caption per report and can change that vote.

## Local setup

1. Run `supabase/profiles.sql`, then `supabase/assignment4.sql` in the Supabase SQL Editor.
2. Copy `.env.example` to `.env.local` and add the Supabase project values and a Gemini API key.
3. Enable Google authentication in Supabase and use `/auth/callback` as the app callback route.
4. Install and run the app:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Security

Row Level Security is enabled on every public application table. Public visitors receive read access to the archive. Authenticated users can update only their own profile, create only their own reports, upload only to their own storage folder, and create or change only their own votes. Gemini and Supabase server secrets remain in environment variables.
