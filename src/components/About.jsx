import usePhotos from '../hooks/usePhotos.js'

export default function About() {
  const { aboutPortrait } = usePhotos()

  return (
    <section id="about" className="relative isolate scroll-mt-20 overflow-hidden">
      {/* The portrait is the section background — same move as the hero, one
          photo instead of a wall. The left-heavy gradient keeps the text
          column readable while the right side stays photographic. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <img
          src={aboutPortrait.src}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover object-[70%_center] grayscale"
        />
        <div className="absolute inset-0 bg-linear-to-r from-ink via-ink/80 to-ink/30" />
        <div className="absolute inset-0 bg-linear-to-b from-ink via-transparent to-ink" />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-32 sm:py-44 lg:px-8">
        <div className="max-w-xl">
          <p className="text-xs font-medium tracking-[0.3em] text-paper/60 uppercase">Sobre mí</p>
          <h2 className="mt-4 font-display text-4xl font-light tracking-tight text-pretty text-paper sm:text-6xl">
            Rodrigo <span className="italic">Suárez</span>
          </h2>
          <p className="mt-3 text-sm font-medium tracking-[0.2em] text-paper/60 uppercase">
            Fotógrafo y productor audiovisual
          </p>
          <p className="mt-8 text-lg/8 font-light text-pretty text-paper/80">
            Con más de 10 años de experiencia en el mundo de la fotografía, he convertido mi pasión por capturar
            momentos en una forma de expresión y profesión.
          </p>
          <p className="mt-6 text-base/7 font-light text-pretty text-paper/60">
            A lo largo de mi trayectoria he trabajado en diferentes áreas, como fotografía de eventos, retrato,
            producto, deportes y proyectos comerciales, colaborando con marcas y empresas como Grupo La Comer y
            Mercado Pago, así como en producciones para artistas como El Bogueto.
          </p>
          <p className="mt-6 text-base/7 font-light text-pretty text-paper/60">
            Con el tiempo, mi trabajo ha evolucionado hacia la producción audiovisual, creación de contenido y
            gestión de redes sociales, buscando contar historias, transmitir ideas y dar vida a cada proyecto a
            través de imágenes y videos.
          </p>
          <p className="mt-8 font-display text-xl/8 font-light text-pretty text-paper italic">
            Para mí, cada fotografía es una historia y cada proyecto una nueva oportunidad para crear.
          </p>
          <div className="mt-10">
            <a
              href="#contact"
              className="group inline-flex items-center gap-x-3 text-xs font-medium tracking-[0.2em] text-paper uppercase"
            >
              Contáctame
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
