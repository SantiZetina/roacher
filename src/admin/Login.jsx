import { useState } from 'react'
import { supabase } from '../lib/supabase.js'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) setError('Correo o contraseña incorrectos.')
    setBusy(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6 font-sans text-paper">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <h1 className="font-display text-3xl font-light italic">Admin</h1>
        <p className="mt-2 text-sm text-ash">Inicia sesión para administrar las fotos del sitio.</p>
        <label className="mt-8 block text-xs font-medium tracking-[0.2em] text-ash uppercase">
          Correo
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 block w-full border border-white/15 bg-coal px-3 py-2.5 text-sm text-paper outline-none focus:border-white/40"
          />
        </label>
        <label className="mt-5 block text-xs font-medium tracking-[0.2em] text-ash uppercase">
          Contraseña
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 block w-full border border-white/15 bg-coal px-3 py-2.5 text-sm text-paper outline-none focus:border-white/40"
          />
        </label>
        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="mt-8 w-full bg-paper px-8 py-3 text-xs font-medium tracking-[0.2em] text-ink uppercase transition-colors hover:bg-white disabled:opacity-50"
        >
          {busy ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
