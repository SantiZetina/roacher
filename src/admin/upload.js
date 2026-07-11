import { supabase } from '../lib/supabase.js'

// Photos are resized in the browser before upload so originals straight off
// a camera (10MB+) never hit storage or visitors. 2400px covers the
// full-bleed panorama on large screens.
const MAX_DIMENSION = 2400
const JPEG_QUALITY = 0.85

async function resizeToBlob(file) {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  canvas.getContext('2d').drawImage(bitmap, 0, 0, width, height)
  bitmap.close()
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Could not process the image'))), 'image/jpeg', JPEG_QUALITY)
  })
}

// Uploads a photo and returns its public URL.
export async function uploadPhoto(file, slot) {
  const blob = await resizeToBlob(file)
  const path = `${slot}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`
  const { error } = await supabase.storage.from('photos').upload(path, blob, { contentType: 'image/jpeg' })
  if (error) throw error
  return supabase.storage.from('photos').getPublicUrl(path).data.publicUrl
}

// Best-effort cleanup of a replaced/deleted photo's file. Ignores failures —
// an orphaned file in the bucket is harmless.
export async function removeStoredPhoto(publicUrl) {
  const path = publicUrl?.split('/object/public/photos/')[1]
  if (!path) return
  await supabase.storage.from('photos').remove([decodeURIComponent(path)]).catch(() => {})
}
