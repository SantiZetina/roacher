import { lazy, Suspense, useState } from 'react'
import usePhotos from '../hooks/usePhotos.js'
import Lightbox from './Lightbox.jsx'

const MagnifyPhoto = lazy(() => import('./MagnifyPhoto.jsx'))

// Caption overlaid on the photo itself — the mosaic reads as one wall of
// images, so the labels live inside the frames instead of under them.
function Caption({ number, title, category }) {
  return (
    <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-baseline justify-between gap-x-4 bg-linear-to-t from-ink/85 via-ink/40 to-transparent px-4 pt-16 pb-4 sm:px-5">
      <span className="flex items-baseline gap-x-3">
        <span aria-hidden="true" className="font-display text-lg font-light text-paper/60 italic">
          {number}
        </span>
        <span className="truncate text-sm font-medium text-paper">{title}</span>
      </span>
      <span className="hidden text-xs font-medium tracking-[0.2em] text-paper/60 uppercase sm:block">{category}</span>
    </figcaption>
  )
}

export default function Gallery() {
  const { galleryPhotos } = usePhotos()
  const [lightboxIndex, setLightboxIndex] = useState(null)

  // The mosaic repeats a six-photo pattern: a big feature square, a 2x2
  // block of squares, and a full-width panorama. Any photo count works —
  // a short final group just renders fewer tiles and skips the panorama.
  const groups = []
  for (let i = 0; i < galleryPhotos.length; i += 6) {
    groups.push(galleryPhotos.slice(i, i + 6))
  }

  // The whole tile opens the lightbox via bubbling — an overlay button would
  // sit on the magnifier canvas and starve it of pointer events. The sr-only
  // button gives keyboard users the same entry point (its click bubbles too).
  const tileButton = (title) => (
    <button type="button" className="sr-only">
      View {title} full screen
    </button>
  )
  const number = (index) => String(index + 1).padStart(2, '0')

  return (
    <section id="work" className="scroll-mt-20 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        <p className="text-xs font-medium tracking-[0.3em] text-ash uppercase">Selected work</p>
        <h2 className="mt-4 max-w-lg font-display text-4xl font-light tracking-tight text-pretty text-paper sm:text-6xl">
          A few frames <span className="italic">worth keeping</span>
        </h2>
      </div>

      {/* Full-bleed mosaic: same gap-4/px-4 rhythm as the hero wall, so the
          two sections read as one system. */}
      <div className="mt-16 flex flex-col gap-4 px-4">
        {groups.map((group, groupIndex) => {
          const base = groupIndex * 6
          const [feature, ...rest] = group
          const squares = rest.slice(0, 4)
          const panorama = rest[4]
          // Alternate the feature square between left and right per group so
          // long galleries don't read as a repeated template.
          const featureOrder = groupIndex % 2 ? 'lg:order-2' : ''

          return (
            <div key={base} className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <figure
                onClick={() => setLightboxIndex(base)}
                className={`group relative aspect-4/5 cursor-zoom-in overflow-hidden bg-coal sm:aspect-square ${featureOrder}`}
              >
                <img
                  alt={feature.title}
                  src={feature.src}
                  className="absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.02] pointer-fine:grayscale pointer-fine:group-hover:grayscale-0"
                />
                {/* The glass-magnifier shader rides only the first feature —
                    one shader canvas on the page, not one per group. */}
                {groupIndex === 0 && (
                  <Suspense fallback={null}>
                    <MagnifyPhoto src={feature.src} className="absolute inset-0 h-full w-full" />
                  </Suspense>
                )}
                <Caption number={number(base)} title={feature.title} category={feature.category} />
                {tileButton(feature.title)}
              </figure>

              {squares.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {squares.map((photo, index) => (
                    <figure
                      key={photo.src}
                      onClick={() => setLightboxIndex(base + index + 1)}
                      className="group relative aspect-square cursor-zoom-in overflow-hidden bg-coal"
                    >
                      <img
                        alt={photo.title}
                        src={photo.src}
                        className="absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.04] pointer-fine:grayscale pointer-fine:group-hover:grayscale-0"
                      />
                      <Caption number={number(base + index + 1)} title={photo.title} category={photo.category} />
                      {tileButton(photo.title)}
                    </figure>
                  ))}
                </div>
              )}

              {panorama && (
                <figure
                  onClick={() => setLightboxIndex(base + 5)}
                  className="group relative aspect-3/2 cursor-zoom-in overflow-hidden bg-coal sm:aspect-21/9 lg:order-3 lg:col-span-2"
                >
                  <img
                    alt={panorama.title}
                    src={panorama.src}
                    className="absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.02] pointer-fine:grayscale pointer-fine:group-hover:grayscale-0"
                  />
                  <Caption number={number(base + 5)} title={panorama.title} category={panorama.category} />
                  {tileButton(panorama.title)}
                </figure>
              )}
            </div>
          )
        })}
      </div>

      <div className="mx-auto mt-12 max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        <a
          href="#contact"
          className="group inline-flex items-center gap-x-3 text-xs font-medium tracking-[0.2em] text-paper uppercase"
        >
          Prints &amp; commissions available
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </a>
      </div>

      <Lightbox
        photos={galleryPhotos}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </section>
  )
}
