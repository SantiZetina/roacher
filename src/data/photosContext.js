import { createContext } from 'react'
import { aboutPortrait, galleryPhotos, heroWall } from './site.jsx'

// The static data from site.jsx is the fallback: it renders immediately and
// stays if Supabase isn't configured, the fetch fails, or a slot is empty.
export const fallbackPhotos = { heroWall, galleryPhotos, aboutPortrait }

export const PhotosContext = createContext(fallbackPhotos)
