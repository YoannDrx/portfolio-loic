'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Cone, Float } from '@react-three/drei';
import * as THREE from 'three';

function LightBeams() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      groupRef.current.children.forEach((child, i) => {
         child.scale.y = 1 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.2;
      });
    }
  });

  return (
    <group ref={groupRef} position={[0, 2, 0]}>
       {[...Array(5)].map((_, i) => (
         <Cone 
            key={i} 
            args={[1, 8, 32, 1, true]} 
            position={[0, 0, 0]} 
            rotation={[Math.PI, 0, (i / 5) * Math.PI * 2]}
         >
            <meshBasicMaterial 
               color={i % 2 === 0 ? "#ff0055" : "#ff00ff"} 
               transparent 
               opacity={0.1} 
               side={THREE.DoubleSide} 
               depthWrite={false}
               blending={THREE.AdditiveBlending}
            />
         </Cone>
       ))}
    </group>
  );
}

export default function VideosScene() {
  return (
    <div className="w-full h-full absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, -2, 10], fov: 50 }}>
        <color attach="background" args={['#0a0a0f']} />
        <fog attach="fog" args={['#0a0a0f', 5, 25]} />
        
        <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
           <LightBeams />
        </Float>
      </Canvas>
    </div>
  );
}