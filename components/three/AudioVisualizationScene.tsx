'use client';

import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float, Environment } from '@react-three/drei';
import { useTheme } from 'next-themes';
import AudioWaveform from './AudioWaveform';

/* ============================================
   SCENE CONTENT COMPONENT
   ============================================ */

function SceneContent() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Theme-aware colors
  const isDark = !mounted || resolvedTheme === 'dark';
  const bgColor = isDark ? '#0a0a0f' : '#2d2d42';
  const fogColor = isDark ? '#0a0a0f' : '#353548';

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 5, 15]} fov={45} />
      <color attach="background" args={[bgColor]} />
      <fog attach="fog" args={[fogColor, 10, 30]} />

      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ccff00" />
      <pointLight position={[-10, -5, -10]} intensity={1} color="#00f0ff" />

      <Suspense fallback={null}>
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          {/* Main Ring - Lime */}
          <AudioWaveform count={100} radius={6} color="#ccff00" />

          {/* Inner Ring - Cyan */}
          <group rotation={[Math.PI / 6, 0, 0]}>
            <AudioWaveform count={80} radius={4} color="#00f0ff" />
          </group>

          {/* Outer Ring - Purple */}
          <group rotation={[-Math.PI / 6, 0, 0]}>
            <AudioWaveform count={120} radius={9} color="#8b5cf6" />
          </group>
        </Float>

        <Environment preset="city" />
      </Suspense>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
      />
    </>
  );
}

/* ============================================
   MAIN COMPONENT
   ============================================ */

export default function AudioVisualizationScene() {
  return (
    <div className="w-full h-full absolute inset-0 -z-10">
      <Canvas gl={{ antialias: true, toneMappingExposure: 1.5 }}>
        <SceneContent />
      </Canvas>
    </div>
  );
}