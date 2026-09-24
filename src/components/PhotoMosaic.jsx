import { useState } from 'react'
import Lightbox from './Lightbox.jsx'

// Title only, overlaid on the photo. With a mouse it fades in on hover so
// the wall reads as pure images; touch screens have no hover, so there it
// stays visible.
function Caption({ title }) {
  if (!title) return null
  return (
    <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-linear-to-t from-ink/80 via-ink/30 to-transparent px-4 pt-16 pb-4 transition-opacity duration-500 sm:px-5 pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100">
      <span className="block truncate text-sm font-medium text-paper">{title}</span>
    </figcaption>
  )
}

// One section's grid of photos, with its own lightbox. Each section on the
// page renders its own mosaic, so indices here are local to `photos` — the
// lightbox opened from Deportivo only ever pages through Deportivo.
export default function PhotoMosaic({ photos }) {
  const [lightboxIndex, setLightboxIndex] = useState(null)

  // The mosaic repeats a six-photo pattern: a big feature square, a 2x2
  // block of squares, and a full-width panorama. Any photo count works —
  // a short final group just renders fewer tiles and skips the panorama.
  const groups = []
  for (let i = 0; i < photos.length; i += 6) {
    groups.push(photos.slice(i, i + 6))
  }

  // The whole tile opens the lightbox via bubbling. The sr-only button gives
  // keyboard users the same entry point (its click bubbles too).
  const tileButton = (title) => (
    <button type="button" className="sr-only">
      Ver {title} en pantalla completa
    </button>
  )

  return (
    <>
      {/* Full-bleed mosaic: same gap-4/px-4 rhythm as the hero wall, so the
          sections read as one system. */}
      <div className="flex flex-col gap-4 px-4">
        {groups.map((group, groupIndex) => {
          const base = groupIndex * 6
          const [feature, ...rest] = group
          const squares = rest.slice(0, 4)
          const panorama = rest[4]
          // Alternate the feature square between left and right per group so
          // long sections don't read as a repeated template.
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
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
                <Caption title={feature.title} />
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
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />
                      <Caption title={photo.title} />
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
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  />
                  <Caption title={panorama.title} />
                  {tileButton(panorama.title)}
                </figure>
              )}
            </div>
          )
        })}
      </div>

      <Lightbox
        photos={photos}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </>
  )
}
