# The Yoga School website

The Yoga School Cairns website (theyogaschool.com.au), built with Next.js.

**The app lives in [`YogaSchool-v2/web`](YogaSchool-v2/web).** That is the only copy; its README covers running,
building and the project structure.

| Folder | What it is |
|---|---|
| `YogaSchool-v2/web` | The Next.js website (deployed by the Vercel project `web` → web-beta-azure-30.vercel.app) |
| `YogaSchool-v2/supabase` | Database schema and setup for the site's content |
| `YogaSchool-v2/static-site-archive` | The approved static HTML site the Next.js app was migrated from (reference only) |
| `YogaSchool-v2/exports` | SEO URL map and a homepage PDF export |

```bash
cd YogaSchool-v2/web
npm install
cp .env.example .env.local   # Supabase URL + publishable key (never commit .env.local)
npm run dev                  # http://localhost:3000/pages/home
```
