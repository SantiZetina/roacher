import { site, socials } from '../data/site.jsx'

export default function Footer() {
  return (
    <footer className="overflow-hidden border-t border-white/10">
      <p
        aria-hidden="true"
        className="-mb-[0.16em] text-center font-display text-[12vw] leading-none font-light whitespace-nowrap text-white/4 italic select-none"
      >
        {site.shortName}
      </p>
      <div className="mx-auto max-w-7xl border-t border-white/5 px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        {/* Accounts with a handle show it next to the icon — Rodrigo has three
            Instagrams, and identical icons alone wouldn't say which is which. */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 md:order-2">
          {socials.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-x-2 text-ash transition-colors hover:text-paper"
            >
              <item.icon aria-hidden="true" className="size-5" />
              {item.handle ? (
                <span className="text-xs tracking-wide">{item.handle}</span>
              ) : (
                <span className="sr-only">{item.name}</span>
              )}
            </a>
          ))}
        </div>
        <p className="mt-8 text-center text-xs font-medium tracking-[0.2em] text-ash uppercase md:order-1 md:mt-0">
          &copy; {new Date().getFullYear()} {site.name} — {site.tagline}
        </p>
      </div>
    </footer>
  )
}
