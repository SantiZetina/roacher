import { lazy, Suspense } from 'react'
import { galleryPhotos } from '../data/site.jsx'

const MagnifyPhoto = lazy(() => import('./MagnifyPhoto.jsx'))

// Asymmetric editorial placements for the photos after the feature, cycled by
// index. Column starts/spans are tuned so consecutive photos stagger instead
// of forming uniform rows.
const placements = [
  { position: 'lg:col-span-4 lg:col-start-1', aspect: 'aspect-4/5' },
  { position: 'lg:col-span-6 lg:col-start-7 lg:mt-24', aspect: 'aspect-3/2' },
  { position: 'lg:col-span-5 lg:col-start-2 lg:mt-16', aspect: 'aspect-4/5' },
  { position: 'lg:col-span-6 lg:col-start-7 lg:mt-32', aspect: 'aspect-3/2' },
  { position: 'lg:col-span-7 lg:col-start-3 lg:mt-20', aspect: 'aspect-3/2' },
]

export default function Gallery() {
  const [feature, ...rest] = galleryPhotos

  return (
    <section id="work" className="scroll-mt-20 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        <p className="text-xs font-medium tracking-[0.3em] text-ash uppercase">Selected work</p>
        <h2 className="mt-4 max-w-lg font-display text-4xl font-light tracking-tight text-pretty text-paper sm:text-6xl">
          A few frames <span className="italic">worth keeping</span>
        </h2>
      </div>
      {/* Feature panorama: wider than the grid photos, framed like a mounted
          print, with the glass-magnifier shader */}
      <figure className="mx-auto mt-20 max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        <div className="border border-white/15 p-2 sm:p-3">
          <div className="relative aspect-3/2 overflow-hidden bg-coal sm:aspect-21/9">
            <img
              alt={feature.title}
              src={feature.src}
              className="absolute inset-0 h-full w-full object-cover grayscale"
            />
            <Suspense fallback={null}>
              <MagnifyPhoto src={feature.src} className="absolute inset-0 h-full w-full" />
            </Suspense>
            <div className="pointer-events-none absolute inset-0 ring-1 ring-white/10 ring-inset" />
          </div>
        </div>
        <figcaption className="mt-4 flex items-baseline justify-between border-b border-white/10 pb-4">
          <span className="flex items-baseline gap-x-4">
            <span aria-hidden="true" className="font-display text-xl font-light text-ash italic">
              01
            </span>
            <span className="text-sm font-medium text-paper">{feature.title}</span>
          </span>
          <span className="text-xs font-medium tracking-[0.2em] text-ash uppercase">{feature.category}</span>
        </figcaption>
      </figure>
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        <div className="mt-24 grid grid-cols-1 gap-y-20 lg:grid-cols-12 lg:gap-x-6">
          {rest.map((photo, index) => {
            const placement = placements[index % placements.length]
            return (
              <figure key={photo.title} className={`group ${placement.position}`}>
                <div className="relative overflow-hidden">
                  <img
                    alt={photo.title}
                    src={photo.src}
                    className={`${placement.aspect} w-full bg-coal object-cover grayscale transition-all duration-700 ease-out group-hover:scale-[1.03] group-hover:grayscale-0`}
                  />
                  <div className="pointer-events-none absolute inset-0 ring-1 ring-white/10 ring-inset" />
                </div>
                <figcaption className="mt-4 flex items-baseline justify-between border-b border-white/10 pb-4">
                  <span className="flex items-baseline gap-x-4">
                    <span aria-hidden="true" className="font-display text-xl font-light text-ash italic">
                      {String(index + 2).padStart(2, '0')}
                    </span>
                    <span className="text-sm font-medium text-paper">{photo.title}</span>
                  </span>
                  <span className="text-xs font-medium tracking-[0.2em] text-ash uppercase">{photo.category}</span>
                </figcaption>
              </figure>
            )
          })}
        </div>
      </div>
    </section>
  )
}
