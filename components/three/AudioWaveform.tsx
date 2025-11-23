'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AudioWaveformProps {
  count?: number;
  radius?: number;
  color?: string;
}

export default function AudioWaveform({
  count = 60,
  radius = 5,
  color = '#ccff00',
}: AudioWaveformProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Initial positions
  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      
      // Simulate audio data with noise
      const noise = Math.sin(angle * 5 + time * 2) * 0.5 + Math.cos(angle * 3 - time) * 0.5;
      const height = 1 + Math.max(0, noise * 2); // Ensure positive height
      
      // Position in a circle
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      dummy.position.set(x, 0, z);
      dummy.rotation.y = -angle; // Rotate to face center
      dummy.scale.set(0.2, height, 0.2); // Scale height based on "audio"
      
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    
    // Slowly rotate the entire ring
    meshRef.current.rotation.y += 0.002;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
        toneMapped={false}
      />
    </instancedMesh>
  );
}