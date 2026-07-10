import { useEffect, useState } from 'react'

// Dev-only diagnostic: reports what this browser says about WebGPU so shader
// visibility issues can be diagnosed at a glance. Not rendered in production.
export default function WebGPUBadge() {
  const [status, setStatus] = useState(() =>
    'gpu' in navigator ? 'checking…' : 'unsupported in this browser/context',
  )

  useEffect(() => {
    if (!('gpu' in navigator)) return
    let cancelled = false
    const timer = setTimeout(() => {
      if (!cancelled) setStatus('adapter request hung (GPU blocked?)')
    }, 6000)
    navigator.gpu
      .requestAdapter()
      .then((adapter) => {
        if (cancelled) return
        clearTimeout(timer)
        setStatus(adapter ? 'active' : 'no adapter (GPU blocklisted?)')
      })
      .catch((error) => {
        if (cancelled) return
        clearTimeout(timer)
        setStatus(`error: ${error.message}`)
      })
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [])

  return (
    <div className="fixed bottom-3 left-3 z-50 border border-white/15 bg-ink/90 px-3 py-1.5 text-[11px] font-medium tracking-wide text-ash">
      WebGPU: <span className={status === 'active' ? 'text-paper' : 'text-red-400'}>{status}</span>
    </div>
  )
}
