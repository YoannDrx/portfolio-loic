'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AudioWaveformProps {
  count?: number;
  radius?: number;
  color?: string;
  speed?: number;
}

export default function AudioWaveform({
  count = 100,
  radius = 8,
  color = '#00f0ff',
  speed = 0.5,
}: AudioWaveformProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Generate positions for particles in a wave pattern
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 4; // Multiple waves
      const x = Math.cos(t) * radius;
      const y = Math.sin(t * 2) * 2; // Wave motion
      const z = Math.sin(t) * radius;
      temp.push({ x, y, z, t });
    }
    return temp;
  }, [count, radius]);

  // Animate particles
  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime() * speed;

    particles.forEach((particle, i) => {
      const { x, y: _y, z, t } = particle;

      // Create wave animation
      const waveY = Math.sin(t + time) * 2 + Math.cos(t * 2 + time * 0.5) * 1;
      const scale = 0.5 + Math.sin(t + time) * 0.3;

      const matrix = new THREE.Matrix4();
      matrix.makeTranslation(x, waveY, z);
      matrix.scale(new THREE.Vector3(scale, scale, scale));

      meshRef.current!.setMatrixAt(i, matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        metalness={0.8}
        roughness={0.2}
      />
    </instancedMesh>
  );
}
