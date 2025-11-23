'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Torus, Float, Stars } from '@react-three/drei';
import type * as THREE from 'three';

function VinylRecord() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1 + Math.PI / 3; // Tilted
    }
  });

  return (
    <group>
      {/* Disc */}
      <Torus ref={meshRef} args={[3, 1.5, 2, 100]} rotation={[Math.PI / 2, 0, 0]}>
         <meshStandardMaterial 
            color="#000000" 
            roughness={0.2} 
            metalness={0.8} 
            emissive="#00f0ff"
            emissiveIntensity={0.1}
            wireframe
         />
      </Torus>
      
      {/* Center Label Glow */}
      <mesh position={[0, 0, -1]}>
         <sphereGeometry args={[1, 32, 32]} />
         <meshBasicMaterial color="#00f0ff" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

export default function AlbumsScene() {
  return (
    <div className="w-full h-full absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <color attach="background" args={['#0a0a0f']} />
        <fog attach="fog" args={['#0a0a0f', 5, 20]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} color="#00f0ff" intensity={2} />
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
           <VinylRecord />
        </Float>
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      </Canvas>
    </div>
  );
}