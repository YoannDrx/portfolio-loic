'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Icosahedron, Line, Float } from '@react-three/drei';
import * as THREE from 'three';

function Network() {
  const groupRef = useRef<THREE.Group>(null);
  
  const points = useMemo(() => {
     const p = [];
     for(let i=0; i<20; i++) {
        p.push(new THREE.Vector3(
           (Math.random() - 0.5) * 10,
           (Math.random() - 0.5) * 10,
           (Math.random() - 0.5) * 10
        ));
     }
     return p;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
       {points.map((pt, i) => (
          <mesh key={i} position={pt}>
             <sphereGeometry args={[0.1, 16, 16]} />
             <meshBasicMaterial color="#ccff00" />
          </mesh>
       ))}
       
       {/* Connect some points */}
       {points.map((pt, i) => {
          if (i === points.length - 1) return null;
          // Connect to next 2 points
          const next = points[(i + 1) % points.length];
          const next2 = points[(i + 2) % points.length];
          
          return (
             <group key={i}>
                <Line points={[pt, next]} color="#ccff00" transparent opacity={0.2} lineWidth={1} />
                <Line points={[pt, next2]} color="#ccff00" transparent opacity={0.1} lineWidth={1} />
             </group>
          );
       })}
       
       <Icosahedron args={[4, 1]} visible={false}>
          <meshBasicMaterial wireframe color="#333" />
       </Icosahedron>
    </group>
  );
}

export default function ContactScene() {
  return (
    <div className="w-full h-full absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <color attach="background" args={['#0a0a0f']} />
        <fog attach="fog" args={['#0a0a0f', 8, 20]} />
        
        <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.2}>
           <Network />
        </Float>
      </Canvas>
    </div>
  );
}