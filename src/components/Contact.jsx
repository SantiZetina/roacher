import { lazy, Suspense } from 'react'
import { site } from '../data/site.jsx'
import usePhotos from '../hooks/usePhotos.js'

const IridescentAmbient = lazy(() => import('./IridescentAmbient.jsx'))

export default function Contact() {
  // Borrow the gallery's feature photo for the backdrop — it's the strongest
  // frame on the page and admin-managed, so this stays current on its own.
  const { galleryPhotos } = usePhotos()
  const backdrop = galleryPhotos[0]

  return (
    <section id="contact" className="relative isolate scroll-mt-20 overflow-hidden border-t border-white/10">
      {/* A dim photo backdrop echoes the hero; the iridescent shader (or the
          gradient alone, without WebGPU) plays on top of it. */}
      <div aria-hidden="true" className="absolute inset-0 -z-20">
        <img
          src={backdrop.src}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover opacity-30 grayscale"
        />
        <div className="absolute inset-0 bg-[radial-gradient(80%_90%_at_30%_0%,rgba(29,28,26,0.55)_0%,rgba(10,10,11,0.9)_75%)]" />
        <div className="absolute inset-0 bg-linear-to-b from-ink via-transparent to-ink" />
      </div>
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
