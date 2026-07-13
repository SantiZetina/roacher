-- Roacher admin: run this once in the Supabase SQL editor
-- (Dashboard -> SQL Editor -> New query -> paste -> Run).
-- Everything is idempotent-ish: if you run it twice you'll get
-- "already exists" errors, which are safe to ignore.

-- The photo list. `slot` says where the photo appears:
--   wall    = the hero photo wall at the top (any number, ordered)
--   about   = the About section portrait (one photo)
--   gallery = the Selected Work mosaic (any number, ordered by sort_order;
--             it repeats every 6: big square, 4 squares, panorama)
--   hero    = legacy slot from the old design; no longer displayed
create table public.photos (
  id uuid primary key default gen_random_uuid(),
  slot text not null default 'gallery' check (slot in ('hero', 'about', 'gallery', 'wall')),
  src text not null,
  title text not null default '',
  category text not null default '',
  span text not null default 'narrow' check (span in ('narrow', 'wide')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Anyone can read (the public site fetches this), only a signed-in
-- user (Rodrigo) can change anything.
alter table public.photos enable row level security;

create policy "public read" on public.photos
  for select using (true);

create policy "authenticated write" on public.photos
  for all to authenticated using (true) with check (true);

-- Public storage bucket for the image files themselves.
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true);

create policy "public read photos bucket" on storage.objects
  for select using (bucket_id = 'photos');

create policy "authenticated insert photos bucket" on storage.objects
  for insert to authenticated with check (bucket_id = 'photos');

create policy "authenticated update photos bucket" on storage.objects
  for update to authenticated using (bucket_id = 'photos');

create policy "authenticated delete photos bucket" on storage.objects
  for delete to authenticated using (bucket_id = 'photos');

-- ============================================================
-- MIGRATION for a database created before the 'wall' slot existed
-- (the photo-wall redesign). If you already ran the setup above,
-- run ONLY these two lines to allow wall photos:
--
-- alter table public.photos drop constraint photos_slot_check;
-- alter table public.photos add constraint photos_slot_check
--   check (slot in ('hero', 'about', 'gallery', 'wall'));
-- ============================================================
