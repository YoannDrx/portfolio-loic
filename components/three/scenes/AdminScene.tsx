'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function MatrixRain() {
  const count = 100;
  const ref = useRef<THREE.InstancedMesh>(null);
  const temp = new THREE.Object3D();

  const drops = useMemo(() => {
    return new Array(count).fill(0).map(() => ({
      x: (Math.random() - 0.5) * 40,
      y: Math.random() * 20,
      z: (Math.random() - 0.5) * 10,
      speed: Math.random() * 0.1 + 0.05,
    }));
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    drops.forEach((drop, i) => {
      drop.y -= drop.speed;
      if (drop.y < -10) drop.y = 10;
      temp.position.set(drop.x, drop.y, drop.z);
      temp.scale.set(0.05, 0.5, 0.05);
      temp.updateMatrix();
      ref.current!.setMatrixAt(i, temp.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <boxGeometry />
      <meshBasicMaterial color="#00f0ff" transparent opacity={0.3} />
    </instancedMesh>
  );
}

export default function AdminScene() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none opacity-50">
      <Canvas camera={{ position: [0, 0, 15] }}>
        <MatrixRain />
      </Canvas>
    </div>
  );
}
