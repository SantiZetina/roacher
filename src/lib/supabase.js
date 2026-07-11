import { createClient } from '@supabase/supabase-js'

// Null until the two VITE_SUPABASE_* env values exist (.env.local locally,
// project env vars on Vercel). Everything that uses this must keep working
// without it — the site falls back to the data in src/data/site.jsx.
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = url && anonKey ? createClient(url, anonKey) : null
