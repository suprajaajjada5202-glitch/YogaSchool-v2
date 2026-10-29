# The Yoga School: Next.js website

The Yoga School Cairns website, built with **Next.js 16 (App Router)**, **React 19** and **TypeScript**.
It was migrated from the approved static HTML site in the parent folder. The design, content and URLs are unchanged.

## Run it

```bash
npm install
cp .env.example .env.local     # then fill in the Supabase URL + publishable key
npm run dev                    # http://localhost:3000/pages/home
npm run build && npm start     # production
```

Node 20.9 or newer is required.

## URLs (same as the live site)

| URL | File |
|---|---|
| `/`, `/home`, `/pages/home` | `src/app/(site)/page.tsx`, `home/`, `pages/home/` → `views/HomePage.tsx` |
| `/pages/classes`, `/pages/timetable`, `/pages/prices`, `/pages/teachers`, `/pages/photo-gallery`, `/pages/events`, `/pages/blog1`, `/pages/teacher-training`, `/pages/testimonials`, `/pages/contact-us`, `/pages/about`, `/pages/faqs`, `/pages/videos`, `/pages/shop` | `src/app/(site)/pages/<name>/page.tsx` |
| `/workplace-wellbeing`, `/gift-vouchers` | `src/app/(site)/<name>/page.tsx` |
| `/pages/blog-why-yoga` (and the other 4 built-in articles) | `src/app/(site)/pages/[slug]/page.tsx` |
| `/pages/post?slug=…` (articles added in /admin) | `src/app/(site)/pages/post/page.tsx` |
| `/admin` | `src/app/admin/page.tsx` |
| `/sitemap.xml`, `/robots.txt` | `src/app/sitemap.ts`, `src/app/robots.ts` |

Old `.html` links (`/pages/classes.html`) redirect permanently to the clean URL (`next.config.ts`).

## Project structure

```
src/
  app/
    layout.tsx            root <html>, fonts, global CSS
    globals.css           the site stylesheet (design tokens at the top)
    (site)/layout.tsx     header + menu, footer, SVG icons for every public page
    (site)/error.tsx      friendly error page
    not-found.tsx         404 page
    api/contact/route.ts  contact form → Supabase
    admin/                staff dashboard
  views/                  one component per page (server components)
  components/             reusable UI. Client components are marked "use client":
                          Header, Reveal, Slider, HeroSlider, TestimonialSlider, MomentsStrip,
                          Gallery, Sheet, VideoButton, InlineYouTube, TeacherDirectory,
                          ContactForm, Timetable, MomenceWidget
  data/content.ts         built-in content (teachers, classes, posts, gallery, prices …)
  data/seo.json           page titles, descriptions, canonical URLs, structured data
  lib/data.ts             server-side content loaders (Supabase with built-in fallback)
  lib/supabase.ts         Supabase REST helper (publishable key only)
  admin/                  admin dashboard components
public/images/            optimised photos (gallery, teachers, master teachers)
scripts/                  one-time migration tools + the original page HTML they read
```

## Content and Supabase

- Pages read **Supabase** on the server and refresh every **60 seconds** (`export const revalidate = 60`).
- If Supabase is not set up, or a table is empty, the page shows the built-in content from `src/data/content.ts`.
- The timetable, events and gift vouchers show nothing extra until rows are **published** in /admin. The live Momence widget always shows on the Timetable and Events pages.
- The contact form posts to `/api/contact`, which saves to the `contact_messages` table.
- Database setup is in the parent folder: `../supabase/schema.sql`, `seed.sql` and `README.md`.

**Keys:** only the **publishable** key is used (`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`). It is safe in the browser because Row Level Security protects the data. Never add the secret / `service_role` key to this project.

## Deploy

- **Vercel / Netlify:** import the `web` folder, set the two environment variables and deploy.
- **Your own Node server:** run `npm run build` then `npm start` behind your web server, setting `PORT` if needed.

## Editing

- **Text and photos:** most content lives in `src/data/content.ts`, or in the page view in `src/views/`. With Supabase connected, edit it in **/admin** instead.
- **Home page hero slideshow:** `heroSlides` in `src/data/content.ts` (4 photos). A slide can show a video instead:
  put the file in `public/videos/` and add `video: "/videos/name.mp4"` to that slide (it plays muted and looping).
- **Page heroes (every inner page):** the photo in the page's hero (`.arch__frame` image in its view) fills the banner
  and its badge shows bottom right. Add `page-hero--portrait` to the section for a small photo of people: on wider
  screens it fills only the right half, fading into the dark background (About, Teacher Training). Pages without a photo use the default set on `.page-hero` in `globals.css`.
- **Home page class photos:** `public/images/modalities/` holds temporary crops of studio photos, one per class
  (Knoff Yoga, Strength, Mobility, Chair Yoga, Yin Yoga). Replace each file with the final photo under the same name;
  names, text and links for the cards are in `modalities` in `src/data/content.ts`.
- **Design:** `src/app/globals.css`. Colours, fonts and spacing are CSS variables in `:root`.
- **Menu:** `src/lib/site.ts` (`PRIMARY`, `MORE`, `TILES`).

## Migration notes

`scripts/import-static.py` and `scripts/convert.py` generated `src/views/*`, `src/data/content.ts`,
`Footer.tsx` and `Sprite.tsx` from the static pages. They were a one-time step. Edit the TSX files
directly from now on; re-running the scripts would overwrite those edits.
