'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import AudioWaveform from './AudioWaveform';

export default function AudioVisualizationScene() {
  return (
    <div className="w-full h-full">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={75} />

        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00f0ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff006e" />

        {/* Audio Waveforms with different colors */}
        <Suspense fallback={null}>
          {/* Cyan waveform */}
          <AudioWaveform count={100} radius={8} color="#00f0ff" speed={0.5} />

          {/* Magenta waveform - slightly offset */}
          <group rotation={[0, Math.PI / 3, 0]}>
            <AudioWaveform count={80} radius={6} color="#ff006e" speed={0.6} />
          </group>

          {/* Purple waveform - another offset */}
          <group rotation={[0, -Math.PI / 3, 0]}>
            <AudioWaveform count={60} radius={4} color="#8b5cf6" speed={0.7} />
          </group>
        </Suspense>

        {/* Camera controls for subtle auto-rotation */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}
