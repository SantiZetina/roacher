import usePhotos from '../hooks/usePhotos.js'

export default function About() {
  const { aboutPortrait } = usePhotos()

  return (
    <section id="about" className="relative isolate scroll-mt-20 overflow-hidden">
      {/* The portrait gets its own column at its natural proportions instead of
          being the section background — a cover-cropped background cut the head
          off full-body shots. Nothing is cropped now, whatever shape Rodrigo
          uploads; the height cap only stops a very tall photo from towering
          over the text. On phones it sits above the text. */}
      <div className="mx-auto grid max-w-7xl items-center gap-x-16 gap-y-12 px-6 py-24 sm:py-32 lg:grid-cols-2 lg:px-8">
        <div className="flex justify-center lg:order-2 lg:justify-end">
          <img
            src={aboutPortrait.src}
            alt={aboutPortrait.alt}
            loading="lazy"
            className="h-auto max-h-[70vh] w-auto max-w-full object-contain grayscale lg:max-h-[85vh]"
          />
        </div>

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
