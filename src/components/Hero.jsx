import { site } from '../data/site.jsx'
import usePhotos from '../hooks/usePhotos.js'

// 4 columns × 4 photos keeps every column taller than the viewport, so the
// drift animation never exposes an edge.
const WALL_TILES = 16

// Per-column treatment: alternate drift directions and stagger the starting
// offsets so the wall never reads as aligned rows. Columns 3 and 4 only
// mount at wider breakpoints — phones get a two-column wall.
const columnClasses = [
  'wall-drift-up',
  'wall-drift-down -mt-20',
  'wall-drift-up -mt-8 hidden sm:flex',
  'wall-drift-down -mt-24 hidden lg:flex',
]

export default function Hero() {
  const { heroWall } = usePhotos()

  // Cycle however many photos exist (admin-managed, could be 3 or 30) to
  // fill all 16 tiles, split into four columns round-robin so the order in
  // the admin reads left-to-right across the top row.
  const columns = [[], [], [], []]
  for (let i = 0; i < WALL_TILES; i++) {
    columns[i % 4].push({ ...heroWall[i % heroWall.length], key: i })
  }

  return (
    // The header is fixed and transparent up top, so the wall runs the full
    // viewport height and slides underneath it.
    <section className="relative isolate flex min-h-svh items-center overflow-hidden">
      {/* Photo wall background. Decorative only — the real photos live in the
          gallery — so it's aria-hidden and fully desaturated under a heavy
          ink gradient to keep the headline readable. Hovering a tile lets its
          color through. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="grid h-full grid-cols-2 gap-4 px-4 sm:grid-cols-3 lg:grid-cols-4">
          {columns.map((column, columnIndex) => (
            <div key={columnIndex} className={`flex flex-col gap-4 ${columnClasses[columnIndex]}`}>
              {column.map((photo) => (
                <img
                  key={photo.key}
                  src={photo.src}
                  alt=""
                  loading={columnIndex > 1 ? 'lazy' : 'eager'}
                  className="aspect-3/4 w-full bg-coal object-cover grayscale transition-[filter] duration-700 ease-out pointer-fine:hover:grayscale-0"
                />
              ))}
            </div>
          ))}
        </div>
        {/* pointer-events-none so hovering a tile reaches the image below —
            the color reveal only works if the overlays don't eat the hover. */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-ink/70 via-ink/60 to-ink" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(85%_70%_at_50%_45%,transparent_0%,rgba(10,10,11,0.7)_100%)]" />
      </div>

      <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-6 py-28 text-center sm:py-36">
        <p className="text-xs font-medium tracking-[0.3em] text-paper/60 uppercase">
          {site.tagline} — {site.photographer}
        </p>
        <h1 className="mt-8 font-display text-6xl leading-[1.02] font-light tracking-tight text-balance text-paper sm:text-8xl lg:text-9xl">
          Quiet moments, <span className="italic">carefully framed.</span>
        </h1>
        <p className="mt-8 max-w-md text-lg/8 font-light text-pretty text-paper/70">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua.
        </p>
        <div className="mt-12 flex items-center gap-x-8">
          <a
            href="#work"
            className="border border-paper/25 px-6 py-3 text-xs font-medium tracking-[0.2em] text-paper uppercase transition-colors hover:border-paper/60"
          >
            View the work
          </a>
          <a
            href="#contact"
            className="group inline-flex items-center gap-x-3 text-xs font-medium tracking-[0.2em] text-paper/70 uppercase transition-colors hover:text-paper"
          >
            Get in touch
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="absolute inset-x-0 bottom-6 text-center text-xs font-medium tracking-[0.3em] text-paper/40 uppercase"
      >
        Scroll ↓
      </p>
    </section>
  )
}
