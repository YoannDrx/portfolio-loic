'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Cone, Float } from '@react-three/drei';
import { useTheme } from 'next-themes';
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

function SceneContent() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Theme-aware colors
  const isDark = !mounted || resolvedTheme === 'dark';
  const bgColor = isDark ? '#0a0a0f' : '#2d2d42';  // Lighter cinematic blue-gray
  const fogColor = isDark ? '#0a0a0f' : '#353548';

  return (
    <>
      <color attach="background" args={[bgColor]} />
      <fog attach="fog" args={[fogColor, 5, 25]} />

      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
        <LightBeams />
      </Float>
    </>
  );
}

export default function VideosScene() {
  return (
    <div className="w-full h-full absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, -2, 10], fov: 50 }}>
        <SceneContent />
      </Canvas>
    </div>
  );
}