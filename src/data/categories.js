// The gallery's sections, in the order they appear down the page.
//
// This is the only place the list lives: the site's sections, the header nav,
// and the admin's per-section upload panels all read from here, so adding a
// section to this array is all it takes to create it everywhere.
//
// `id` is what gets stored in the photos table's `category` column — keep it
// stable, since changing one orphans every photo already filed under it.
// `slug` is the anchor the nav links to, `name` the heading, `blurb` the line
// under it, and `kicker` the small label above it.
export const categories = [
  {
    id: 'Sociales',
    slug: 'sociales',
    name: 'Sociales',
    kicker: 'Eventos',
    blurb: 'Bodas, XV años, bautizos y graduaciones.',
  },
  {
    id: 'Deportivo',
    slug: 'deportivo',
    name: 'Deportivo',
    kicker: 'Deporte',
    blurb: 'Deporte en movimiento, dentro y fuera de la cancha.',
  },
  {
    id: 'Retrato',
    slug: 'retrato',
    name: 'Retrato',
    kicker: 'Retrato',
    blurb: 'Retrato en luz natural, en estudio y en locación.',
  },
]

export const categoryIds = categories.map((c) => c.id)

export function findCategory(id) {
  return categories.find((c) => c.id === id)
}
