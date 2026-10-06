import { useEffect, useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { instagramHref, instagramIcon as InstagramIcon, navigation } from '../data/site.jsx'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  // Transparent while the photo-wall hero is behind it; gains the ink blur
  // and border once the page scrolls.
  const [scrolled, setScrolled] = useState(false)
  // Slides away while scrolling down so the photos get the whole screen, and
  // comes back as soon as the visitor scrolls up — the usual "I want the menu"
  // gesture. Always shown near the top of the page.
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 24)
      // Ignore tiny movements so trackpad jitter doesn't make it flicker.
      if (Math.abs(y - lastY) < 8) return
      setHidden(y > lastY && y > 120)
      lastY = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    // focus-within keeps it on screen for keyboard users tabbing into the nav.
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,translate] duration-300 focus-within:translate-y-0 ${
        scrolled ? 'border-white/10 bg-ink/80 backdrop-blur-md' : 'border-transparent bg-transparent'
      } ${hidden && !mobileMenuOpen ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
        {/* Deliberately empty: no wordmark up here — the hero states the name.
            The spacer keeps the nav links centred against Instagram on the right. */}
        <div className="flex lg:flex-1" />
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center p-2.5 text-ash"
          >
            <span className="sr-only">Abrir menú</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-10">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-xs font-medium tracking-[0.2em] text-ash uppercase transition-colors hover:text-paper"
            >
              {item.name}
            </a>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end">
          <a
            href={instagramHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-x-2 text-xs font-medium tracking-[0.2em] text-ash uppercase transition-colors hover:text-paper"
          >
            <InstagramIcon aria-hidden="true" className="size-4" />
            Instagram
          </a>
        </div>
      </nav>
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-ink p-6 sm:max-w-sm sm:ring-1 sm:ring-white/10">
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 p-2.5 text-ash"
            >
              <span className="sr-only">Cerrar menú</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-10 flow-root">
            <div className="space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="-mx-3 block px-3 py-3 text-sm font-medium tracking-[0.2em] text-paper uppercase hover:bg-white/5"
                >
                  {item.name}
                </a>
              ))}
              <a
                href={instagramHref}
                target="_blank"
                rel="noopener noreferrer"
                className="-mx-3 flex items-center gap-x-3 px-3 py-3 text-sm font-medium tracking-[0.2em] text-ash uppercase hover:bg-white/5"
              >
                <InstagramIcon aria-hidden="true" className="size-5" />
                Instagram
              </a>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}
