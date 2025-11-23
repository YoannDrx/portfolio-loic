'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

function DNA() {
  const pointsRef = useRef<THREE.Points>(null);
  
  const count = 200; // Number of particles per strand
  const radius = 2;
  const height = 12;
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 2 * 3);
    const colors = new Float32Array(count * 2 * 3);
    
    const color1 = new THREE.Color('#ccff00'); // Neon Lime
    const color2 = new THREE.Color('#ffaa00'); // Warm Orange

    for (let i = 0; i < count; i++) {
      const t = i / count;
      const angle = t * Math.PI * 8; // 4 turns
      const y = (t - 0.5) * height;
      
      // Strand 1
      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;
      
      positions[i * 3] = x1;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z1;
      
      colors[i * 3] = color1.r;
      colors[i * 3 + 1] = color1.g;
      colors[i * 3 + 2] = color1.b;

      // Strand 2 (Offset by PI)
      const x2 = Math.cos(angle + Math.PI) * radius;
      const z2 = Math.sin(angle + Math.PI) * radius;
      
      const j = i + count;
      positions[j * 3] = x2;
      positions[j * 3 + 1] = y;
      positions[j * 3 + 2] = z2;
      
      colors[j * 3] = color2.r;
      colors[j * 3 + 1] = color2.g;
      colors[j * 3 + 2] = color2.b;
    }
    
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.005;
      pointsRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <Points ref={pointsRef} positions={particles.positions} colors={particles.colors} stride={3}>
      <PointMaterial
        transparent
        vertexColors
        size={0.15}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export default function AboutScene() {
  return (
    <div className="w-full h-full absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <color attach="background" args={['#0a0a0f']} />
        <fog attach="fog" args={['#0a0a0f', 5, 20]} />
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
           <DNA />
        </Float>
      </Canvas>
    </div>
  );
}
