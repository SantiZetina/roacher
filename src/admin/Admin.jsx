import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import Login from './Login.jsx'
import Dashboard from './Dashboard.jsx'

export default function Admin() {
  const [session, setSession] = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setChecking(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => setSession(next))
    return () => listener.subscription.unsubscribe()
  }, [])

  if (!supabase) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink px-6 font-sans text-paper">
        <div className="max-w-md text-center">
          <h1 className="font-display text-2xl font-light italic">Admin isn&apos;t set up yet</h1>
          <p className="mt-4 text-sm/6 text-ash">
            Supabase isn&apos;t connected. Follow the steps in <code className="text-paper">ADMIN-SETUP.md</code> in the
            project folder, then add <code className="text-paper">VITE_SUPABASE_URL</code> and{' '}
            <code className="text-paper">VITE_SUPABASE_ANON_KEY</code> to the environment.
          </p>
        </div>
      </div>
    )
  }

  if (checking) return <div className="min-h-screen bg-ink" />

  return session ? <Dashboard /> : <Login />
}
