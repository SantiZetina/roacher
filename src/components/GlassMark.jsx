import { Shader, FlowField, Glass, SolidColor, Swirl } from 'shaders/react'
import useMediaQuery from '../hooks/useMediaQuery.js'

// Santiago's edited mark, exported from his shaders.com dashboard: green
// swirl seen through glass, stirred by a flow field. The SDF was downloaded
// from the export to /sdf so the site doesn't fetch it remotely. Renders
// nothing without WebGPU — the caller keeps a CSS disc underneath.
export default function GlassMark({ className }) {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  if (typeof navigator === 'undefined' || !navigator.gpu) return null

  return (
    <Shader aria-hidden="true" className={className}>
      <SolidColor color="#0a0a0a" />
      <Glass
        aberration={0.89}
        cutout={true}
        edgeSoftness={0.2}
        fresnel={0.01}
        fresnelSoftness={0.14}
        refraction={1.09}
        scale={0.7}
        shapeSdfUrl="/sdf/email-mark_sdf.bin"
        thickness={0.27}
      >
        <Swirl
          blend={56}
          colorA="#54fd64"
          colorB="#000301"
          colorSpace="oklab"
          detail={4.2}
          speed={reducedMotion ? 0 : 0.1}
        />
        <FlowField
          detail={1}
          evolutionSpeed={reducedMotion ? 0 : 1.5}
          speed={reducedMotion ? 0 : 1.8}
          strength={0.5}
        />
      </Glass>
    </Shader>
  )
}
