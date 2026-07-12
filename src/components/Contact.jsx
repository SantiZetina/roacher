import { lazy, Suspense } from 'react'
import { site } from '../data/site.jsx'

const IridescentAmbient = lazy(() => import('./IridescentAmbient.jsx'))

export default function Contact() {
  return (
    <section id="contact" className="relative isolate scroll-mt-20 overflow-hidden border-t border-white/10">
      {/* Static stand-in for the shader so the section has depth even without WebGPU */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(80%_90%_at_30%_0%,#1d1c1a_0%,#0a0a0b_75%)]"
      />
      <Suspense fallback={null}>
        <IridescentAmbient />
      </Suspense>
      <div className="px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium tracking-[0.3em] text-ash uppercase">Contact</p>
          <h2 className="mt-4 font-display text-4xl font-light tracking-tight text-balance text-paper sm:text-6xl">
            Prints, commissions, and <span className="italic">collaborations</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg/8 font-light text-pretty text-ash">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua ut enim ad minim veniam.
          </p>
          <div className="mt-10 flex items-center justify-center">
            <a
              href={`mailto:${site.email}`}
              className="bg-paper px-8 py-3.5 text-xs font-medium tracking-[0.2em] text-ink uppercase transition-colors hover:bg-white"
            >
              {site.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
