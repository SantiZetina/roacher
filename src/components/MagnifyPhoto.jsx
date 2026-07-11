import { Shader, FilmGrain, Glass, Godrays, Grayscale, ImageTexture } from 'shaders/react'
import useMediaQuery from '../hooks/useMediaQuery.js'

// The full-bleed feature panorama: volumetric light rays over the photo, and
// a magnifying lens that follows the cursor — made for panoramas with a small
// subject to hunt for. Renders nothing without WebGPU — the caller keeps a
// plain <img> underneath.
export default function MagnifyPhoto({ src, className }) {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  // The lens follows the cursor, so on touch devices it just sits in the
  // middle of the frame — skip the shader entirely there.
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')

  if (typeof navigator === 'undefined' || !navigator.gpu || !finePointer) return null

  return (
    <Shader aria-hidden="true" className={className}>
      <ImageTexture url={src} objectFit="cover" />
      <Grayscale />
      <Godrays
        center={{ x: 0.32, y: -0.05 }}
        density={0.25}
        intensity={0.5}
        spotty={0.8}
        speed={reducedMotion ? 0 : 0.25}
        rayColor="#e6dcc3"
        blendMode="screen"
        opacity={0.55}
      />
      <Glass
        center={
          reducedMotion
            ? { x: 0.5, y: 0.5 }
            : { type: 'mouse-position', reach: 1, originX: 0.5, originY: 0.5, momentum: 0.25, smoothing: 0.15 }
        }
        fresnel={0.05}
        fresnelSoftness={0.06}
        innerZoom={1.7}
        refraction={0.46}
        thickness={0.04}
      />
      <FilmGrain strength={0.05} />
    </Shader>
  )
}
