import { Shader, CursorRipples, FilmGrain, Grayscale, ImageTexture, RadialGradient } from 'shaders/react'
import useMediaQuery from '../hooks/useMediaQuery.js'

// The featured portrait, alive: a warm film-style light leak breathes across
// the frame, and the image ripples like water under the cursor. Renders
// nothing without WebGPU — the caller keeps a plain <img> underneath.
export default function RipplePhoto({ src, alt, className }) {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  if (typeof navigator === 'undefined' || !navigator.gpu) return null

  return (
    <Shader className={className} role="img" aria-label={alt}>
      <ImageTexture url={src} objectFit="cover" />
      <Grayscale />
      <RadialGradient
        colorA="#5f5648"
        colorB="#000000"
        center={{ x: 0.2, y: 0.08 }}
        radius={
          reducedMotion
            ? 0.9
            : { type: 'auto-animate', mode: 'ping-pong', outputMin: 0.7, outputMax: 1.15, speed: 0.07, easing: 'sine' }
        }
        blendMode="screen"
        opacity={0.7}
      />
      {!reducedMotion && <CursorRipples intensity={8} decay={6} radius={0.35} chromaticSplit={1.2} edges="mirror" />}
      <FilmGrain strength={0.05} />
    </Shader>
  )
}
