import { site, socials } from '../data/site.jsx'

export default function Footer() {
  return (
    <footer className="overflow-hidden border-t border-white/10">
      <p
        aria-hidden="true"
        className="-mb-[0.16em] text-center font-display text-[19vw] leading-none font-light text-white/4 italic select-none"
      >
        {site.name}
      </p>
      <div className="mx-auto max-w-7xl border-t border-white/5 px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center gap-x-6 md:order-2">
          {socials.map((item) => (
            <a key={item.name} href={item.href} className="text-ash transition-colors hover:text-paper">
              <span className="sr-only">{item.name}</span>
              <item.icon aria-hidden="true" className="size-5" />
            </a>
          ))}
        </div>
        <p className="mt-8 text-center text-xs font-medium tracking-[0.2em] text-ash uppercase md:order-1 md:mt-0">
          &copy; {new Date().getFullYear()} {site.name} — {site.photographer}
        </p>
      </div>
    </footer>
  )
}
