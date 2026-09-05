import { categories } from '../data/categories.js'
import usePhotos from '../hooks/usePhotos.js'
import PhotoMosaic from './PhotoMosaic.jsx'

// Each category is its own section down the page, with its own heading and
// its own mosaic — a client who shoots weddings can land straight on
// #sociales from the nav and never scroll past the sports work.
export default function Gallery() {
  const { galleryPhotos } = usePhotos()

  // Photos filed under a name that's no longer in categories.js would
  // otherwise vanish from the site entirely, so they get a section of their
  // own at the end rather than disappearing silently.
  const known = new Set(categories.map((c) => c.id))
  const orphans = galleryPhotos.filter((p) => !known.has(p.category))

  const sections = categories
    .map((category) => ({ ...category, photos: galleryPhotos.filter((p) => p.category === category.id) }))
    // An empty section would be a heading over nothing — skip it until
    // Rodrigo uploads work for it.
    .filter((section) => section.photos.length > 0)

  if (orphans.length) {
    sections.push({
      id: '__otras',
      slug: 'otras',
      name: 'Otras',
      kicker: 'Más trabajo',
      blurb: 'Fotos sin categoría asignada.',
      photos: orphans,
    })
  }

  return (
    // #work keeps working as an anchor for the hero's "Ver el trabajo" button:
    // it lands on the first section.
    <div id="work" className="scroll-mt-20">
      {sections.map((section, index) => (
        <section key={section.id} id={section.slug} className="scroll-mt-20 py-24 sm:py-28">
          <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
            <p className="text-xs font-medium tracking-[0.3em] text-ash uppercase">{section.kicker}</p>
            <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
              <h2 className="font-display text-4xl font-light tracking-tight text-pretty text-paper sm:text-6xl">
                {section.name}
              </h2>
              <p className="text-sm text-ash">{section.blurb}</p>
            </div>
            <div aria-hidden="true" className="mt-8 border-t border-white/10" />
          </div>

          <div className="mt-12">
            {/* Only the first section gets the WebGPU magnifier — one shader
                canvas per page keeps phones happy. */}
            <PhotoMosaic photos={section.photos} withShader={index === 0} />
          </div>
        </section>
      ))}

      <div className="mx-auto max-w-2xl px-6 pb-8 lg:max-w-7xl lg:px-8">
        <a
          href="#contact"
          className="group inline-flex items-center gap-x-3 text-xs font-medium tracking-[0.2em] text-paper uppercase"
        >
          Impresiones y encargos disponibles
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </a>
      </div>
    </div>
  )
}
