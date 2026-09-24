// All site content lives here. When the admin panel is built later,
// it only needs to read/write this data (or a JSON version of it) —
// the components render whatever is in these arrays.

import { categories } from './categories.js'

// `name` is the full byline (footer copyright, SEO). `shortName` is the
// display-size version — the footer watermark sets it at 12vw on one line, so
// a full name would overflow on narrow screens. The WhatsApp number is still
// a placeholder: swap it when Rodrigo sends the real one. There's no email on
// purpose — clients in Mexico book over WhatsApp.
//
// `whatsapp` is the number in international format, digits only — for a
// Mexican cell that's 52 + the 10-digit number (no +, spaces or the old 1).
export const site = {
  name: 'Rodrigo Suárez',
  shortName: 'Rodrigo',
  tagline: 'Fotografía · Ciudad de México',
  whatsapp: '520000000000',
  whatsappMessage: 'Hola Rodrigo, vi tu portafolio y me gustaría cotizar una sesión.',
}

// Opens a WhatsApp chat with the message already typed, so a client only has
// to hit send. Works on phones (the app) and desktop (WhatsApp Web).
export const whatsappHref = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(site.whatsappMessage)}`

// One nav entry per gallery section, so each kind of work is reachable from
// the header without scrolling. Built from categories.js so adding a section
// there adds it to the nav too.
export const navigation = [
  ...categories.map((category) => ({ name: category.name, href: `#${category.slug}` })),
  { name: 'Sobre mí', href: '#about' },
  { name: 'Contacto', href: '#contact' },
]

// Fallback photos for the hero wall, shown until Rodrigo uploads his own
// through the admin panel (slot 'wall'). The Hero cycles whatever it gets to
// fill all 16 tiles, so any count works — portrait orientation looks best.
export const heroWall = [
  { src: '/photos/hero-portrait.jpg', alt: 'Portrait in natural light' },
  {
    src: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=400&h=600&q=80',
    alt: 'Mountain lake at dusk',
  },
  {
    src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=400&h=600&q=80',
    alt: 'Sunlight through forest trees',
  },
  {
    src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&h=600&q=80',
    alt: 'Portrait in natural light',
  },
  { src: '/photos/canopy.jpg', alt: 'Forest canopy' },
  {
    src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=400&h=600&q=80',
    alt: 'City street from above',
  },
  {
    src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&h=600&q=80',
    alt: 'Hills under morning mist',
  },
]

// Gallery photos. The mosaic fills a repeating pattern in order: one big
// feature square, four small squares, one full-width panorama — so photos
// 1, 7, 13… get the feature frame and 6, 12, 18… the panorama.
//
// `category` must match an id in categories.js for a photo to appear under
// a filter tab. These placeholders are spread across all three so the tabs
// are visible (and testable) before Rodrigo uploads his own work.
export const galleryPhotos = [
  {
    src: '/photos/canopy.jpg',
    title: 'Primera luz',
    category: 'Sociales',
    span: 'wide',
  },
  {
    src: 'https://images.unsplash.com/photo-1494548162494-384bba4ab999?auto=format&fit=crop&w=800&h=800&q=80',
    title: 'Brindis',
    category: 'Sociales',
    span: 'narrow',
  },
  {
    src: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&h=800&q=80',
    title: 'Última vuelta',
    category: 'Deportivo',
    span: 'narrow',
  },
  {
    src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&h=800&q=80',
    title: 'Medio tiempo',
    category: 'Deportivo',
    span: 'wide',
  },
  {
    src: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1200&h=800&q=80',
    title: 'Estudio en sombra',
    category: 'Retrato',
    span: 'wide',
  },
  {
    src: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&h=800&q=80',
    title: 'Contraluz',
    category: 'Retrato',
    span: 'narrow',
  },
]

export const aboutPortrait = {
  src: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=1200&h=1600&q=80',
  alt: 'Photographer at work',
}

export const socials = [
  {
    name: 'Instagram',
    href: '#',
    icon: (props) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path
          fillRule="evenodd"
          d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    name: 'WhatsApp',
    href: whatsappHref,
    icon: (props) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: '#',
    icon: (props) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path
          fillRule="evenodd"
          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
]
