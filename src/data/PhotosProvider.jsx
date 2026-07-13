import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { PhotosContext, fallbackPhotos } from './photosContext.js'

export default function PhotosProvider({ children }) {
  const [value, setValue] = useState(fallbackPhotos)

  useEffect(() => {
    if (!supabase) return
    supabase
      .from('photos')
      .select('*')
      .order('sort_order')
      .then(({ data, error }) => {
        if (error || !data?.length) return
        const wall = data.filter((p) => p.slot === 'wall')
        const about = data.find((p) => p.slot === 'about')
        const gallery = data.filter((p) => p.slot === 'gallery')
        setValue({
          heroWall: wall.length ? wall.map((p) => ({ src: p.src, alt: p.title })) : fallbackPhotos.heroWall,
          aboutPortrait: about ? { src: about.src, alt: about.title } : fallbackPhotos.aboutPortrait,
          galleryPhotos: gallery.length
            ? gallery.map((p) => ({ src: p.src, title: p.title, category: p.category }))
            : fallbackPhotos.galleryPhotos,
        })
      })
  }, [])

  return <PhotosContext.Provider value={value}>{children}</PhotosContext.Provider>
}
