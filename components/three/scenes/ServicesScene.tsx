'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Instance, Instances, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

function EqualizerBars() {
  const numBars = 20;
  const width = 15;
  
  const data = useMemo(() => {
    return new Array(numBars).fill(0).map((_, i) => ({
      x: (i / numBars) * width - width / 2,
      y: -2,
      z: 0,
      scale: Math.random()
    }));
  }, []);

  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.children.forEach((child: any, i) => {
         // Simple sine wave animation simulating music
         const t = state.clock.elapsedTime;
         const noise = Math.sin(t * 5 + i * 0.5) * 0.5 + 0.5; // 0 to 1
         const scaleY = 0.5 + noise * 3;
         child.scale.y = scaleY;
         child.position.y = -2 + scaleY / 2;
         
         // Color shift
         const color = new THREE.Color().setHSL((i / numBars) * 0.2 + 0.6, 0.8, 0.5); // Blue to Purple
         if(child.material) child.material.color = color;
      });
    }
  });

  return (
    <group ref={ref}>
       {data.map((d, i) => (
         <mesh key={i} position={[d.x, d.y, d.z]}>
           <boxGeometry args={[0.5, 1, 0.5]} />
           <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.5} />
         </mesh>
       ))}
    </group>
  );
}

export default function ServicesScene() {
  return (
    <div className="w-full h-full absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 2, 12], fov: 45 }}>
        <color attach="background" args={['#0a0a0f']} />
        <fog attach="fog" args={['#0a0a0f', 8, 25]} />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
          <EqualizerBars />
        </Float>
        
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}