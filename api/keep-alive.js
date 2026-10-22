// Supabase pauses free-tier projects after ~7 days without database
// activity. Vercel Cron (see vercel.json) hits this once a day and runs a
// tiny real query so the project never counts as idle.
export default async function handler(req, res) {
  const url = process.env.VITE_SUPABASE_URL
  const key = process.env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) {
    return res.status(500).json({ ok: false, error: 'Supabase env vars missing' })
  }

  const r = await fetch(`${url}/rest/v1/photos?select=id&limit=1`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  })

  res.status(r.ok ? 200 : 502).json({ ok: r.ok, status: r.status, at: new Date().toISOString() })
}
