import { useContext } from 'react'
import { PhotosContext } from '../data/photosContext.js'

export default function usePhotos() {
  return useContext(PhotosContext)
}
