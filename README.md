# Theyogaschool

Website for The Yoga School, Cairns: Next.js (App Router) + Supabase content + Momence bookings.

## Run it locally

```bash
npm install          # installs the app in web/
cp web/.env.example web/.env.local
npm run dev          # http://localhost:3000/pages/home
```

- Admin panel: http://localhost:3000/admin (sign in with an admin account, see `supabase/README.md`).
- `web/` is the website. `supabase/` has the database schema and starting content.
- `static-site-archive/` is the earlier static HTML version, kept for reference. `exports/` holds the SEO URL map and the homepage PDF.

## Deploy

Deploy the `web/` folder (e.g. on Vercel set **Root Directory** to `web`) and add the two `NEXT_PUBLIC_SUPABASE_*` variables from `web/.env.example`.
