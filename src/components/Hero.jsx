import { lazy, Suspense } from 'react'
import { site } from '../data/site.jsx'
import usePhotos from '../hooks/usePhotos.js'

const RipplePhoto = lazy(() => import('./RipplePhoto.jsx'))

export default function Hero() {
  const { heroFeature } = usePhotos()

  return (
    <section className="relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(90%_70%_at_22%_0%,#232220_0%,#131312_45%,#0a0a0b_100%)]"
      />
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-24 sm:pt-28 lg:px-8">
        <p className="text-xs font-medium tracking-[0.3em] text-ash uppercase">
          {site.tagline} — {site.photographer}
        </p>
        <h1 className="relative z-10 mt-10 font-display text-[15vw] leading-[0.95] font-light tracking-tight text-paper sm:text-8xl lg:text-[8.5rem]">
          Quiet moments,
          <br />
          <span className="text-ash italic">carefully</span> <span className="italic">framed.</span>
        </h1>
        <div className="mt-16 flex flex-col gap-y-16 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-sm">
            <p className="text-lg/8 font-light text-pretty text-ash">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua.
            </p>
            <div className="mt-10">
              <a
                href="#work"
                className="group inline-flex items-center gap-x-3 text-xs font-medium tracking-[0.2em] text-paper uppercase"
              >
                View the work
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>
          </div>
          <div className="w-full max-w-md lg:-mt-40 lg:w-[26rem] lg:flex-none">
            <div className="relative aspect-4/5 w-full overflow-hidden bg-coal">
              {/* Always present under the canvas — the visible photo whenever
                  the shader can't render (no WebGPU, adapter failure). */}
              <img
                src={heroFeature.src}
                alt={heroFeature.alt}
                className="absolute inset-0 h-full w-full object-cover saturate-[.65]"
              />
              <Suspense fallback={null}>
                <RipplePhoto src={heroFeature.src} alt="" className="absolute inset-0 h-full w-full" />
              </Suspense>
              <div className="pointer-events-none absolute inset-0 ring-1 ring-white/10 ring-inset" />
            </div>
            <p className="mt-4 flex items-baseline justify-between text-xs font-medium tracking-[0.2em] text-ash uppercase">
              <span>{heroFeature.caption}</span>
              <span aria-hidden="true">— featured</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
