// src/components/AudioParticles.tsx
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAudioAnalyser } from './useAudioAnalyser';

interface AudioParticlesProps {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  count?: number;
  baseRadius?: number;     // reference radius
  minRadius?: number;      // minimum sphere radius at silence
  radiusFactor?: number;   // additional radius scaling at max bass
  baseWaveAmp?: number;    // base wave amplitude
  audioWaveAmp?: number;   // extra wave amplitude per bass
  idleWaveAmp?: number;    // idle wave amplitude
  idleSpeed?: number;      // idle motion speed multiplier
  smoothFactor?: number;   // 0–1 smoothing factor for radius
}

export const AudioParticles: React.FC<AudioParticlesProps> = ({
  audioRef,
  count         = 10000,
  baseRadius    = 3,
  minRadius     = 0.5,
  radiusFactor  = 1.0,
  baseWaveAmp   = 0.02,
  audioWaveAmp  = 0.08,
  idleWaveAmp   = 0.005,
  idleSpeed     = 0.2,
  smoothFactor  = 0.05,
}) => {
  const meshRef = useRef<THREE.Points>(null);
  const freqData = useAudioAnalyser(audioRef);
  const radiusRef = useRef(minRadius);

  const rootStyles = getComputedStyle(document.documentElement);
  const particleColor = rootStyles.getPropertyValue('--color-primary-muted').trim();

  // Precompute directions and phases for motion
  const { baseDirs, waveDirs1, waveDirs2, phases } = useMemo(() => {
    const bArr = new Float32Array(count * 3);
    const d1Arr = new Float32Array(count * 3);
    const d2Arr = new Float32Array(count * 3);
    const pArr = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // radial unit direction
      const z = 2 * Math.random() - 1;
      const t = Math.random() * Math.PI * 2;
      const r = Math.sqrt(1 - z * z);
      bArr[3*i]   = r * Math.cos(t);
      bArr[3*i+1] = r * Math.sin(t);
      bArr[3*i+2] = z;

      // random direction 1
      let x1 = Math.random() * 2 - 1;
      let y1 = Math.random() * 2 - 1;
      let z1 = Math.random() * 2 - 1;
      const len1 = Math.hypot(x1, y1, z1) || 1;
      d1Arr[3*i]   = x1 / len1;
      d1Arr[3*i+1] = y1 / len1;
      d1Arr[3*i+2] = z1 / len1;
      // direction 2 perpendicular via cross
      const ux = bArr[3*i], uy = bArr[3*i+1], uz = bArr[3*i+2];
      const cx = uy * z1 - uz * y1;
      const cy = uz * x1 - ux * z1;
      const cz = ux * y1 - uy * x1;
      const clen = Math.hypot(cx, cy, cz) || 1;
      d2Arr[3*i]   = cx / clen;
      d2Arr[3*i+1] = cy / clen;
      d2Arr[3*i+2] = cz / clen;

      pArr[i] = Math.random() * Math.PI * 2;
    }
    return { baseDirs: bArr, waveDirs1: d1Arr, waveDirs2: d2Arr, phases: pArr };
  }, [count]);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const posAttr = mesh.geometry.getAttribute('position') as THREE.BufferAttribute;

    // audio state
    const bass = freqData.length > 1 ? freqData[1] / 255 : 0;
    const playing = !!audioRef.current && !audioRef.current.paused;

    // compute raw target radius
    const maxR = baseRadius * (1 + radiusFactor);
    const rawTarget = minRadius + (maxR - minRadius) * (playing ? bass : 0);
    // smooth radius (frame rate independent)
    const k = 1 - Math.pow(1 - smoothFactor, delta * 60);
    radiusRef.current = THREE.MathUtils.lerp(radiusRef.current, rawTarget, k);
    const dynamicR = radiusRef.current;

    // time & speed
    const t = state.clock.getElapsedTime();
    const surfSpeed = playing ? 1 + bass * 2 : idleSpeed;
    const surfAmp   = playing ? baseWaveAmp + audioWaveAmp * bass : idleWaveAmp;
    const internalSpeed = idleSpeed;
    const internalAmp   = idleWaveAmp;

    // update particles
    for (let i = 0; i < count; i++) {
      const bi = 3 * i;
      const bx = baseDirs[bi], by = baseDirs[bi+1], bz = baseDirs[bi+2];
      const d1x = waveDirs1[bi], d1y = waveDirs1[bi+1], d1z = waveDirs1[bi+2];
      const d2x = waveDirs2[bi], d2y = waveDirs2[bi+1], d2z = waveDirs2[bi+2];
      const ph  = phases[i];

      // base pulsating
      let x = bx * dynamicR;
      let y = by * dynamicR;
      let z = bz * dynamicR;

      // surface oscillation
      const w1 = Math.sin(t * surfSpeed + ph) * surfAmp;
      x += d1x * w1;
      y += d1y * w1;
      z += d1z * w1;

      // internal smooth wave
      const w2 = Math.sin(t * internalSpeed + ph) * internalAmp;
      x += d2x * w2;
      y += d2y * w2;
      z += d2z * w2;

      posAttr.array[bi]   = x;
      posAttr.array[bi+1] = y;
      posAttr.array[bi+2] = z;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[new Float32Array(count * 3), 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color={particleColor} />
    </points>
  );
};
