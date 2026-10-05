import { lazy, Suspense, useEffect, useState } from 'react'
import { contactHref } from '../data/site.jsx'

const VoxelShift = lazy(() => import('./VoxelShift.jsx'))

// Resolves true only when the browser can actually hand out a GPU adapter —
// `navigator.gpu` alone isn't enough (some browsers expose it and then return
// no adapter). Until then, and on browsers without WebGPU, the shader library
// (~700 KB gzipped) is never downloaded and the section is text-only.
function useWebGPU() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let cancelled = false
    navigator.gpu
      ?.requestAdapter()
      .then((adapter) => !cancelled && setReady(Boolean(adapter)))
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])
  return ready
}

export default function Contact() {
  const withShader = useWebGPU()

  return (
    <section id="contact" className="relative isolate scroll-mt-20 overflow-hidden border-t border-white/10">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(80%_90%_at_30%_0%,rgba(29,28,26,0.55)_0%,rgba(10,10,11,0.9)_75%)]"
      />
      {/* The Voxel Shift star gets its own space instead of sitting behind the
          text — it's too bright to read over. Beside the text on desktop,
          above it on phones. Without WebGPU it's a single centred column. */}
      <div
        className={`mx-auto px-6 py-24 sm:py-32 lg:px-8 ${
          withShader ? 'grid max-w-7xl items-center gap-y-4 lg:grid-cols-2 lg:gap-x-16' : 'max-w-2xl'
        }`}
      >
        {withShader && (
          <div
            aria-hidden="true"
            className="relative mx-auto aspect-square w-full max-w-xs sm:max-w-sm lg:order-2 lg:max-w-none"
          >
            <Suspense fallback={null}>
              <VoxelShift className="absolute inset-0 h-full w-full" />
            </Suspense>
          </div>
        )}
        <div className={`text-center ${withShader ? 'lg:text-left' : ''}`}>
          <p className="text-xs font-medium tracking-[0.3em] text-ash uppercase">Contacto</p>
          <h2 className="mt-4 font-display text-4xl font-light tracking-tight text-balance text-paper sm:text-6xl">
            Impresiones, encargos y <span className="italic">colaboraciones</span>
          </h2>
          <p
            className={`mx-auto mt-6 max-w-xl text-lg/8 font-light text-pretty text-ash ${withShader ? 'lg:mx-0' : ''}`}
          >
            Eventos, retrato, deporte, producto o un proyecto comercial — cada proyecto es una nueva oportunidad
            para crear. Escríbeme y platiquemos el tuyo.
          </p>
          <div className={`mt-10 flex items-center justify-center ${withShader ? 'lg:justify-start' : ''}`}>
            <a
              href={contactHref}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-paper px-8 py-3.5 text-xs font-medium tracking-[0.2em] text-ink uppercase transition-colors hover:bg-white"
            >
              Escríbeme por Instagram
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
