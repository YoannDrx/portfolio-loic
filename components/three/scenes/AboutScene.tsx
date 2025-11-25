'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

/* ============================================
   TYPES
   ============================================ */

interface MouseState {
  x: number;
  y: number;
}

/* ============================================
   DNA HELIX COMPONENT
   ============================================ */

interface DNAProps {
  mouse: MouseState;
  scrollProgress: number;
}

function DNA({ mouse, scrollProgress }: DNAProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const connectionsRef = useRef<THREE.LineSegments>(null);

  const count = 300; // More particles for denser helix
  const radius = 2.5;
  const height = 14;

  // Generate particles and connections
  const { positions, colors, connectionPositions } = useMemo(() => {
    const positions = new Float32Array(count * 2 * 3);
    const colors = new Float32Array(count * 2 * 3);
    const connectionPositions: number[] = [];

    const color1 = new THREE.Color('#00C18B'); // Emerald
    const color2 = new THREE.Color('#009998'); // Teal
    const color3 = new THREE.Color('#D5FF0A'); // Lime accent

    for (let i = 0; i < count; i++) {
      const t = i / count;
      const angle = t * Math.PI * 10; // 5 turns
      const y = (t - 0.5) * height;

      // Strand 1
      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;

      positions[i * 3] = x1;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z1;

      // Interpolate color along strand
      const colorMix1 = new THREE.Color().lerpColors(color1, color3, t);
      colors[i * 3] = colorMix1.r;
      colors[i * 3 + 1] = colorMix1.g;
      colors[i * 3 + 2] = colorMix1.b;

      // Strand 2 (Offset by PI)
      const x2 = Math.cos(angle + Math.PI) * radius;
      const z2 = Math.sin(angle + Math.PI) * radius;

      const j = i + count;
      positions[j * 3] = x2;
      positions[j * 3 + 1] = y;
      positions[j * 3 + 2] = z2;

      // Interpolate color for strand 2
      const colorMix2 = new THREE.Color().lerpColors(color2, color3, 1 - t);
      colors[j * 3] = colorMix2.r;
      colors[j * 3 + 1] = colorMix2.g;
      colors[j * 3 + 2] = colorMix2.b;

      // Add connections between strands (every 10th particle)
      if (i % 10 === 0) {
        connectionPositions.push(x1, y, z1);
        connectionPositions.push(x2, y, z2);
      }
    }

    return {
      positions,
      colors,
      connectionPositions: new Float32Array(connectionPositions),
    };
  }, []);

  // Animate based on mouse and scroll
  useFrame((state) => {
    if (pointsRef.current) {
      // Base rotation
      pointsRef.current.rotation.y += 0.003;

      // Mouse influence on rotation
      pointsRef.current.rotation.x = mouse.y * 0.3;
      pointsRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.1 + mouse.x * 0.2;

      // Scroll influence - speed up rotation
      pointsRef.current.rotation.y += scrollProgress * 0.02;
    }

    if (connectionsRef.current) {
      connectionsRef.current.rotation.y = pointsRef.current?.rotation.y || 0;
      connectionsRef.current.rotation.x = pointsRef.current?.rotation.x || 0;
      connectionsRef.current.rotation.z = pointsRef.current?.rotation.z || 0;
    }
  });

  return (
    <group>
      {/* Main DNA particles */}
      <Points ref={pointsRef} positions={positions} colors={colors} stride={3}>
        <PointMaterial
          transparent
          vertexColors
          size={0.12}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>

      {/* Connection lines between strands */}
      <lineSegments ref={connectionsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[connectionPositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#00C18B"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}

/* ============================================
   FLOATING PARTICLES COMPONENT
   ============================================ */

interface FloatingParticlesProps {
  mouse: MouseState;
}

function FloatingParticles({ mouse }: FloatingParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 500;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      // Gentle float
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.01;

      // Mouse influence - particles drift towards cursor
      pointsRef.current.position.x = mouse.x * 2;
      pointsRef.current.position.y = mouse.y * 2;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#009998"
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.5}
      />
    </Points>
  );
}

/* ============================================
   GLOW ORB COMPONENT
   ============================================ */

interface GlowOrbProps {
  position: [number, number, number];
  color: string;
  size: number;
  mouse: MouseState;
}

function GlowOrb({ position, color, size, mouse }: GlowOrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Pulse effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.scale.setScalar(scale);

      // Mouse attraction
      meshRef.current.position.x = position[0] + mouse.x * 0.5;
      meshRef.current.position.y = position[1] + mouse.y * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.15}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/* ============================================
   SCENE CONTENT
   ============================================ */

interface SceneContentProps {
  mouse: MouseState;
  scrollProgress: number;
}

function SceneContent({ mouse, scrollProgress }: SceneContentProps) {
  const { camera } = useThree();

  // Subtle camera movement based on mouse
  useFrame(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.position.x += (mouse.x * 1 - camera.position.x) * 0.02;
      camera.position.y += (mouse.y * 0.5 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);
    }
  });

  return (
    <>
      {/* Background */}
      <color attach="background" args={['#0a0a0f']} />
      <fog attach="fog" args={['#0a0a0f', 8, 25]} />

      {/* Main DNA helix */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <DNA mouse={mouse} scrollProgress={scrollProgress} />
      </Float>

      {/* Floating ambient particles */}
      <FloatingParticles mouse={mouse} />

      {/* Glow orbs for depth */}
      <GlowOrb position={[-5, 3, -5]} color="#00C18B" size={2} mouse={mouse} />
      <GlowOrb position={[5, -2, -8]} color="#009998" size={1.5} mouse={mouse} />
      <GlowOrb position={[0, 5, -10]} color="#D5FF0A" size={1} mouse={mouse} />
    </>
  );
}

/* ============================================
   MAIN COMPONENT
   ============================================ */

export default function AboutScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState<MouseState>({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? scrollY / docHeight : 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
      >
        <SceneContent mouse={mouse} scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
