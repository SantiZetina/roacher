import { Shader, Dither, KeyFrames, SolidColor, Voxels } from 'shaders/react'
import useMediaQuery from '../hooks/useMediaQuery.js'

// "Voxel Shift" from Santiago's shaders.com dashboard: an extruded voxel star
// rocking side to side, run through a blue-noise dither. The shape files are
// self-hosted in public/sdf so the section doesn't depend on shaders.com's
// storage staying up. Renders nothing without WebGPU; the caller sizes it.
export default function VoxelShift({ className }) {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  if (typeof navigator === 'undefined' || !navigator.gpu) return null

  return (
    <Shader aria-hidden="true" toneMapping="aces" className={className}>
      <SolidColor color="#ffffff" />
      <Voxels
        ambient={0.85}
        ao={0.66}
        center={{ x: 0.5, y: 0.5 }}
        colorA="#ffffff"
        colorB="#000000"
        colorMode="depth"
        colorVariation={1}
        glossiness={0.94}
        lightAngle={200}
        lightElevation={85}
        lightIntensity={3}
        scale={0.8}
        seams={0}
        shadows={0.53}
        shadowSoftness={0.41}
        shape={{
          depth: 0.5,
          bevel: 0.016,
          rotX: 2,
          rotY: reducedMotion
            ? 0
            : { type: 'auto-animate', mode: 'ping-pong', outputMin: -5, outputMax: 5, speed: 1, easing: 'expo' },
          rotZ: 0,
          type: 'svg',
          svgUrl: '/sdf/voxel-shift.svg',
          geometry: 'extrude',
        }}
        shapeSdfUrl="/sdf/voxel-shift_sdf.bin"
        shapeType="svgExtrude3D"
        specular={0.3}
        voxelScale={0.88}
        voxelSize={0.06}
      />
      <KeyFrames
        agility={0.64}
        lifespan={5}
        lineWidth={4.75}
        markerSize={41}
        threshold={0.33}
        trackers={11}
      />
      {/* Dither's colorA is the *dark* end and colorB the *light* end. The
          white base layer lands on colorB, so making it transparent drops the
          canvas background entirely — the section's own gradient shows
          through and there's no visible square around the star. */}
      <Dither colorA="#edebed" colorB="transparent" pattern="blueNoise" />
    </Shader>
  )
}
