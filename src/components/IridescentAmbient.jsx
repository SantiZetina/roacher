import { Shader, FilmGrain, MultiPointGradient, ThinFilm, WaveDistortion } from 'shaders/react'
import useMediaQuery from '../hooks/useMediaQuery.js'

// Composition exported from the shaders.com editor: a graphite multi-point
// gradient warped by a wave, with an iridescent thin-film shape drifting over
// it. Renders nothing without WebGPU — the caller keeps a CSS gradient behind
// the canvas as the fallback.
export default function IridescentAmbient() {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  if (typeof navigator === 'undefined' || !navigator.gpu) return null

  return (
    <Shader aria-hidden="true" toneMapping="neutral" className="absolute inset-0 -z-10 h-full w-full">
      <MultiPointGradient
        colorA="#5c5c5c"
        colorB="#2a2c30"
        colorC="#242529"
        colorD="#383838"
        colorE="#212121"
        positionA={{ x: 0, y: 0 }}
        positionB={{ x: 0.71, y: 0.06 }}
        positionC={{ x: 0.26, y: 0.73 }}
        positionD={{ x: 1, y: 1 }}
      />
      <WaveDistortion angle={19} strength={0.6} />
      <ThinFilm
        center={{ x: 0.14, y: 0.42 }}
        colorA="#292929"
        colorC="#2b2b2b"
        colorSpace="oklab"
        dispersion={0.91}
        edgeSoftness={0.1}
        intensity={4}
        mode="custom"
        rimWidth={0.22}
        scale={0.8}
        shapeSdfUrl="https://data.shaders.com/storage/v1/object/public/user-uploaded-images/user_33nh0FG48zZa0rIUZuK7vgwPfZe/dJE9-sr_ndcl_sdf.bin"
        speed={reducedMotion ? 0 : 0.23}
        thickness={1}
      />
      <FilmGrain strength={0.1} />
    </Shader>
  )
}
