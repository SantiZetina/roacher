import usePhotos from '../hooks/usePhotos.js'

export default function About() {
  const { aboutPortrait } = usePhotos()

  return (
    <section id="about" className="relative scroll-mt-20">
      <div className="mx-auto max-w-7xl lg:flex lg:justify-between lg:px-8 xl:justify-end">
        <div className="lg:flex lg:w-1/2 lg:shrink lg:grow-0 xl:absolute xl:inset-y-0 xl:right-1/2 xl:w-1/2">
          <div className="group relative h-80 lg:-ml-8 lg:h-auto lg:w-full lg:grow xl:ml-0">
            <img
              alt={aboutPortrait.alt}
              src={aboutPortrait.src}
              className="absolute inset-0 size-full bg-coal object-cover transition duration-700 ease-out pointer-fine:grayscale pointer-fine:group-hover:grayscale-0"
            />
          </div>
        </div>
        <div className="px-6 lg:contents">
          <div className="mx-auto max-w-2xl py-24 sm:py-32 lg:mr-0 lg:ml-8 lg:w-full lg:max-w-lg lg:flex-none xl:w-1/2">
            <p className="text-xs font-medium tracking-[0.3em] text-ash uppercase">About</p>
            <h2 className="mt-4 font-display text-4xl font-light tracking-tight text-pretty text-paper sm:text-6xl">
              Behind <span className="italic">the camera</span>
            </h2>
            <p className="mt-8 text-lg/8 font-light text-ash">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.
            </p>
            <p className="mt-6 text-base/7 font-light text-ash">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
              laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.
            </p>
            <div className="mt-10">
              <a
                href="#contact"
                className="group inline-flex items-center gap-x-3 text-xs font-medium tracking-[0.2em] text-paper uppercase"
              >
                Get in touch
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
