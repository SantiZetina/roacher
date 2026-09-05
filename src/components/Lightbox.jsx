import { useEffect } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline'

// Full-screen viewer for the gallery. The mosaic crops everything to fixed
// tiles, so this is the only place a photo shows its actual full frame.
export default function Lightbox({ photos, index, onClose, onNavigate }) {
  const count = photos.length

  useEffect(() => {
    if (index === null) return
    const onKey = (event) => {
      if (event.key === 'ArrowRight') onNavigate((index + 1) % count)
      if (event.key === 'ArrowLeft') onNavigate((index - 1 + count) % count)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, count, onNavigate])

  if (index === null) return null
  const photo = photos[index]

  return (
    <Dialog open onClose={onClose} className="relative z-50">
      <div aria-hidden="true" className="fixed inset-0 bg-ink/95 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-4 pt-16 pb-14 sm:p-14">
        <DialogPanel className="flex max-h-full w-full max-w-6xl flex-col">
          <img src={photo.src} alt={photo.title} className="min-h-0 w-full flex-1 object-contain" />
          <p className="mt-4 flex items-baseline justify-between gap-x-4">
            <span className="flex items-baseline gap-x-3">
              <span aria-hidden="true" className="font-display text-lg font-light text-paper/60 italic">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="text-sm font-medium text-paper">{photo.title}</span>
            </span>
            <span className="text-xs font-medium tracking-[0.2em] text-paper/60 uppercase">{photo.category}</span>
          </p>
        </DialogPanel>

        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-paper/60 transition-colors hover:text-paper"
        >
          <span className="sr-only">Cerrar</span>
          <XMarkIcon aria-hidden="true" className="size-6" />
        </button>
        <button
          type="button"
          onClick={() => onNavigate((index - 1 + count) % count)}
          className="absolute left-2 p-2 text-paper/60 transition-colors hover:text-paper sm:left-4"
        >
          <span className="sr-only">Foto anterior</span>
          <ChevronLeftIcon aria-hidden="true" className="size-7" />
        </button>
        <button
          type="button"
          onClick={() => onNavigate((index + 1) % count)}
          className="absolute right-2 p-2 text-paper/60 transition-colors hover:text-paper sm:right-4"
        >
          <span className="sr-only">Foto siguiente</span>
          <ChevronRightIcon aria-hidden="true" className="size-7" />
        </button>
      </div>
    </Dialog>
  )
}
