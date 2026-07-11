import { lazy, Suspense, useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { navigation, site } from '../data/site.jsx'

const GlassMark = lazy(() => import('./GlassMark.jsx'))

// Glass disc beside the email: a CSS green-glow fallback with the shader
// mark layered on top once it loads (or never, without WebGPU).
function EmailMark() {
  return (
    <span
      aria-hidden="true"
      className="relative size-5 shrink-0 overflow-hidden rounded-full bg-[radial-gradient(circle_at_35%_30%,#54fd64_0%,#0f2e14_55%,#0a0a0a_100%)] ring-1 ring-white/15 ring-inset"
    >
      <Suspense fallback={null}>
        <GlassMark className="absolute inset-0 h-full w-full" />
      </Suspense>
    </span>
  )
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/80 backdrop-blur-md">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5 font-display text-xl font-medium text-paper italic">
            {site.name}
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center p-2.5 text-ash"
          >
            <span className="sr-only">Open main menu</span>
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
        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:gap-x-3">
          <EmailMark />
          <a
            href={`mailto:${site.email}`}
            className="text-xs font-medium tracking-[0.2em] text-ash uppercase transition-colors hover:text-paper"
          >
            {site.email}
          </a>
        </div>
      </nav>
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-ink p-6 sm:max-w-sm sm:ring-1 sm:ring-white/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5 font-display text-xl font-medium text-paper italic">
              {site.name}
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 p-2.5 text-ash"
            >
              <span className="sr-only">Close menu</span>
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
                href={`mailto:${site.email}`}
                className="-mx-3 flex items-center gap-x-3 px-3 py-3 text-sm font-medium tracking-[0.2em] text-ash uppercase hover:bg-white/5"
              >
                <EmailMark />
                {site.email}
              </a>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}
