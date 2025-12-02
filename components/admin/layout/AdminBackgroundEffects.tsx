'use client';

import { useRef, useMemo, memo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { adminFloatingOrb } from '@/lib/animations';

/* ============================================
   THREE.JS PARTICLE FIELD
   ============================================ */

interface ParticleProps {
  count?: number;
  color?: string;
  size?: number;
}

function ParticleField({ count = 80, color = '#00F0FF', size = 0.03 }: ParticleProps) {
  const ref = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Distribute in a wider area
      positions[i3] = (Math.random() - 0.5) * 50;
      positions[i3 + 1] = (Math.random() - 0.5) * 30;
      positions[i3 + 2] = (Math.random() - 0.5) * 20;

      // Slow velocities for subtle movement
      velocities[i3] = (Math.random() - 0.5) * 0.005;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.005;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.002;
    }

    return { positions, velocities };
  }, [count]);

  useFrame(() => {
    if (!ref.current) return;
    const positions = ref.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Update positions
      positions[i3] += particles.velocities[i3];
      positions[i3 + 1] += particles.velocities[i3 + 1];
      positions[i3 + 2] += particles.velocities[i3 + 2];

      // Wrap around boundaries
      if (positions[i3] > 25) positions[i3] = -25;
      if (positions[i3] < -25) positions[i3] = 25;
      if (positions[i3 + 1] > 15) positions[i3 + 1] = -15;
      if (positions[i3 + 1] < -15) positions[i3 + 1] = 15;
    }

    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  // Create geometry with buffer attribute
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(particles.positions, 3));
    return geo;
  }, [particles.positions]);

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        color={color}
        size={size}
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ============================================
   MATRIX RAIN (Enhanced)
   ============================================ */

function MatrixRain({ count = 60 }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const temp = useMemo(() => new THREE.Object3D(), []);

  const drops = useMemo(() => {
    return new Array(count).fill(0).map(() => ({
      x: (Math.random() - 0.5) * 50,
      y: Math.random() * 25,
      z: (Math.random() - 0.5) * 15 - 5,
      speed: Math.random() * 0.08 + 0.03,
      length: Math.random() * 0.4 + 0.2,
    }));
  }, [count]);

  useFrame(() => {
    if (!ref.current) return;
    drops.forEach((drop, i) => {
      drop.y -= drop.speed;
      if (drop.y < -15) {
        drop.y = 15;
        drop.x = (Math.random() - 0.5) * 50;
      }
      temp.position.set(drop.x, drop.y, drop.z);
      temp.scale.set(0.03, drop.length, 0.03);
      temp.updateMatrix();
      ref.current!.setMatrixAt(i, temp.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <boxGeometry />
      <meshBasicMaterial color="#00F0FF" transparent opacity={0.2} />
    </instancedMesh>
  );
}

/* ============================================
   THREE.JS CANVAS WRAPPER
   ============================================ */

const ThreeCanvas = memo(function ThreeCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 20], fov: 60 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true }}
    >
      <ParticleField count={80} color="#00F0FF" size={0.04} />
      <ParticleField count={40} color="#D5FF0A" size={0.03} />
      <ParticleField count={30} color="#A100F2" size={0.025} />
      <MatrixRain count={50} />
    </Canvas>
  );
});

/* ============================================
   CSS FLOATING ORBS
   ============================================ */

interface OrbConfig {
  color: string;
  size: number;
  position: { top?: string; bottom?: string; left?: string; right?: string };
  delay: number;
  duration: number;
}

const orbConfigs: OrbConfig[] = [
  {
    color: 'rgba(0, 240, 255, 0.15)',
    size: 400,
    position: { top: '-10%', right: '-5%' },
    delay: 0,
    duration: 12,
  },
  {
    color: 'rgba(161, 0, 242, 0.1)',
    size: 300,
    position: { bottom: '10%', left: '-5%' },
    delay: 2,
    duration: 15,
  },
  {
    color: 'rgba(213, 255, 10, 0.08)',
    size: 250,
    position: { top: '40%', right: '20%' },
    delay: 4,
    duration: 10,
  },
  {
    color: 'rgba(255, 0, 110, 0.08)',
    size: 200,
    position: { bottom: '30%', right: '-10%' },
    delay: 1,
    duration: 14,
  },
];

function FloatingOrb({ config }: { config: OrbConfig }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: config.size,
        height: config.size,
        background: `radial-gradient(circle, ${config.color} 0%, transparent 70%)`,
        filter: 'blur(60px)',
        ...config.position,
      }}
      variants={adminFloatingOrb}
      initial="initial"
      animate="animate"
      transition={{
        delay: config.delay,
        duration: config.duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

/* ============================================
   SVG GRID PATTERN
   ============================================ */

function GridPattern() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.03]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="admin-grid"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1" cy="1" r="1" fill="#00F0FF" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#admin-grid)" />
    </svg>
  );
}

/* ============================================
   GRADIENT OVERLAY
   ============================================ */

function GradientOverlay({ isDark }: { isDark: boolean }) {
  return (
    <>
      {/* Top radial glow */}
      <div
        className="absolute top-0 left-0 right-0 h-[50vh] pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0, 240, 255, 0.08), transparent 50%)'
            : 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(79, 70, 229, 0.06), transparent 50%)',
        }}
      />
      {/* Bottom right accent */}
      <div
        className="absolute bottom-0 right-0 w-[50vw] h-[50vh] pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 60% 60% at 100% 100%, rgba(161, 0, 242, 0.05), transparent 60%)'
            : 'radial-gradient(ellipse 60% 60% at 100% 100%, rgba(124, 58, 237, 0.04), transparent 60%)',
        }}
      />
      {/* Vignette - adapté au thème */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(9, 9, 11, 0.4) 100%)'
            : 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(250, 250, 250, 0.6) 100%)',
        }}
      />
    </>
  );
}

/* ============================================
   MAIN COMPONENT
   ============================================ */

interface AdminBackgroundEffectsProps {
  showThreeJS?: boolean;
  showOrbs?: boolean;
  showGrid?: boolean;
  showGradients?: boolean;
  className?: string;
}

export default function AdminBackgroundEffects({
  showThreeJS = true,
  showOrbs = true,
  showGrid = true,
  showGradients = true,
  className = '',
}: AdminBackgroundEffectsProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default to dark to avoid hydration mismatch
  const isDark = !mounted || resolvedTheme === 'dark';

  return (
    <div
      className={`fixed inset-0 -z-10 overflow-hidden pointer-events-none ${className}`}
      style={{ background: 'var(--admin-bg)' }}
    >
      {/* Three.js Canvas - opacité réduite en light mode */}
      {showThreeJS && (
        <div className={cn(
          "absolute inset-0 transition-opacity duration-500",
          isDark ? "opacity-40" : "opacity-20"
        )}>
          <ThreeCanvas />
        </div>
      )}

      {/* CSS Floating Orbs - opacité réduite en light mode */}
      {showOrbs && (
        <div className={cn(
          "transition-opacity duration-500",
          isDark ? "opacity-100" : "opacity-50"
        )}>
          {orbConfigs.map((config, index) => (
            <FloatingOrb key={index} config={config} />
          ))}
        </div>
      )}

      {/* SVG Grid Pattern */}
      {showGrid && <GridPattern />}

      {/* Gradient Overlays */}
      {showGradients && <GradientOverlay isDark={isDark} />}

      {/* Light Mode Softening Overlay - calque blanc pour adoucir */}
      <div
        className={cn(
          'absolute inset-0 pointer-events-none transition-opacity duration-500',
          'bg-white/[0.15]',
          isDark ? 'opacity-0' : 'opacity-100'
        )}
      />

      {/* Noise texture overlay (subtle) */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

/* ============================================
   EXPORTS
   ============================================ */

export { ParticleField, MatrixRain, FloatingOrb, GridPattern, GradientOverlay };
