# Admin panel setup (one-time, ~10 minutes)

The site works without any of this — it shows the photos built into the code.
These steps turn on the admin page at `/admin` where Rodrigo manages photos
himself. Nothing here requires the custom domain.

## 1. Create the Supabase project

1. Go to [supabase.com](https://supabase.com) → **New project**.
2. Any name (e.g. `rodrigo-portfolio`), region **East US**, set a database
   password and save it somewhere (you won't need it day-to-day).

## 2. Run the setup script

1. In the project dashboard: **SQL Editor → New query**.
2. Paste the whole contents of `supabase-setup.sql` (in this folder) and **Run**.
   This creates the photo list, the image storage, and the access rules
   (everyone can view, only a signed-in user can change).

> **Already ran the script before the photo-wall redesign?** Don't re-run it —
> just run the two `alter table` lines in the MIGRATION comment at the bottom
> of `supabase-setup.sql`, so the database accepts hero-wall photos.

## 3. Create Rodrigo's login

1. **Authentication → Users → Add user → Create new user**.
2. His email + a password. Check **Auto confirm user**.
3. That's what he'll use to sign in at `/admin`.

## 4. Connect the site

1. In the project dashboard, click **Connect** in the top bar → **App
   Frameworks** tab → pick **React** + **Vite**. It shows
   `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` ready to copy.
   (Manual route: **Project Settings → API Keys** — use the `publishable`
   key or the legacy `anon public` key, never `secret`/`service_role`.
   The URL is the bare project domain, e.g.
   `https://xxxx.supabase.co` — without `/rest/v1/`.)
2. Locally: copy `.env.local.example` to `.env.local`, paste both values in.
3. On Vercel: **Project → Settings → Environment Variables**, add the same
   two, then **redeploy** — Vite bakes env values in at build time, so the
   change only takes effect on the next build.

## 5. Try it

- Open `yoursite.com/admin` (or `localhost:5173/admin` with `npm run dev`).
- Sign in, upload a gallery photo, check the homepage — it should appear.

## Sections (Sociales / Deportivo / Retrato)

The gallery is split into **separate sections** down the page — each with its
own heading, its own grid, and its own entry in the header nav. A client who
wants a wedding photographer can click **Sociales** and land straight on that
work without scrolling past the sports photos.

The admin mirrors this exactly: one panel per section, each with its **own
"Agregar fotos" button**. Rodrigo picks the section by which button he presses,
so an upload can't land uncategorised by accident. The dropdown under each
photo is there to *move* a photo between sections afterwards.

- Reordering (↑ ↓) is scoped to the section — moving a photo up in Deportivo
  never disturbs Sociales.
- A section with no photos doesn't render on the public site, so an empty
  heading never appears while Rodrigo is still uploading.
- Each section's grid repeats in sixes: one big square, four small, one wide
  panorama. Six or more photos per section looks best; two or three renders a
  short group.
- The lightbox pages within one section only — opening a sports photo and
  hitting → stays in Deportivo.

To add, rename, or reorder sections, edit `src/data/categories.js` — that one
file drives the page sections, the header nav, and the admin panels. The `id`
is what's stored in the database: changing an `id` orphans every photo already
filed under it. Those photos aren't lost — they collect in an **Otras** section
on the site and a **Sin sección** panel in the admin, where they can be re-filed.

**No database migration is needed for this** — sections use the `category`
column that already existed.

## How it behaves

- Photos upload into Supabase storage, resized in the browser first so phone
  and camera originals don't slow the site down.
- The public site loads Rodrigo's photos from Supabase; if a section has no
  uploaded photo yet (or Supabase is ever unreachable), it falls back to the
  placeholder photos built into the code — the site never looks broken.
- Supabase free tier limits (1 GB storage, 5 GB bandwidth/month) are plenty
  for a portfolio. If he ever hits them, the fix is a $25/month plan, not code.

## If the magnifier doesn't appear on the first gallery photo

The big first gallery photo renders through WebGPU (a glass magnifier follows
the cursor on desktop), which is picky about images from another domain.
Supabase sends the right headers so it should just work — but if that photo
ever shows plain, with no magnifier on desktop, after switching to an uploaded
photo, tell Claude "proxy the Supabase images" and it'll route them through
the site's own domain via a Vercel rewrite.
