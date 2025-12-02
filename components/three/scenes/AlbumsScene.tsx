'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Torus, Float } from '@react-three/drei';
import { useTheme } from 'next-themes';
import * as THREE from 'three';

/* ============================================
   TYPES
   ============================================ */

interface MouseState {
  x: number;
  y: number;
}

/* ============================================
   SOUND PARTICLES COMPONENT
   1500 particules émanant du vinyl
   ============================================ */

interface SoundParticlesProps {
  mouse: MouseState;
  scrollProgress: number;
  highlightedAlbum?: number;
}

function SoundParticles({ mouse, scrollProgress, highlightedAlbum }: SoundParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 1500;

  // Generate particle positions and colors
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const white = new THREE.Color('#ffffff');
    const magenta = new THREE.Color('#FF006E');
    const purple = new THREE.Color('#8B5CF6');
    const cyan = new THREE.Color('#00F0FF');

    for (let i = 0; i < count; i++) {
      // Distribute in a spiral pattern around center
      const angle = (i / count) * Math.PI * 20;
      const radius = 2 + (i / count) * 8;
      const height = (Math.random() - 0.5) * 4;

      positions[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 2;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 2;

      // Color distribution: 50% white, 25% magenta, 15% purple, 10% cyan
      const colorChoice = Math.random();
      let color: THREE.Color;
      if (colorChoice < 0.5) {
        color = white;
      } else if (colorChoice < 0.75) {
        color = magenta;
      } else if (colorChoice < 0.9) {
        color = purple;
      } else {
        color = cyan;
      }

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      // Continuous spiral rotation
      pointsRef.current.rotation.y += 0.001;

      // Mouse influence on rotation
      pointsRef.current.rotation.x += (mouse.y * 0.15 - pointsRef.current.rotation.x) * 0.02;
      pointsRef.current.rotation.z += (mouse.x * 0.1 - pointsRef.current.rotation.z) * 0.02;

      // Scroll parallax
      pointsRef.current.position.z = scrollProgress * -3;

      // Highlighted album effect - speed up rotation
      if (highlightedAlbum !== undefined) {
        pointsRef.current.rotation.y += 0.003;
      }

      // Twinkle effect
      const material = pointsRef.current.material as THREE.PointsMaterial;
      material.opacity = 0.6 + Math.sin(state.clock.elapsedTime * 0.8) * 0.2;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} colors={colors} stride={3}>
      <PointMaterial
        transparent
        vertexColors
        size={0.04}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.7}
      />
    </Points>
  );
}

/* ============================================
   GLOW RING COMPONENT
   Anneau lumineux pulsant autour du vinyl
   ============================================ */

interface GlowRingProps {
  highlightedAlbum?: number;
}

function GlowRing({ highlightedAlbum }: GlowRingProps) {
  const ringRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      // Pulse effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 1.2) * 0.1;
      ringRef.current.scale.setScalar(scale);

      // Intensify when album highlighted
      const material = ringRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = highlightedAlbum !== undefined ? 0.25 : 0.15;
    }

    if (outerRingRef.current) {
      // Opposite pulse for depth
      const outerScale = 1 - Math.sin(state.clock.elapsedTime * 0.8) * 0.08;
      outerRingRef.current.scale.setScalar(outerScale);
    }
  });

  return (
    <group rotation={[Math.PI / 3, 0, 0]}>
      {/* Inner glow ring */}
      <mesh ref={ringRef} position={[0, 0, -0.5]}>
        <torusGeometry args={[4, 0.3, 16, 100]} />
        <meshBasicMaterial
          color="#FF006E"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer glow ring */}
      <mesh ref={outerRingRef} position={[0, 0, -0.8]}>
        <torusGeometry args={[5.5, 0.5, 16, 100]} />
        <meshBasicMaterial
          color="#8B5CF6"
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Accent ring */}
      <mesh position={[0, 0, -1]}>
        <torusGeometry args={[6.5, 0.15, 8, 100]} />
        <meshBasicMaterial
          color="#00F0FF"
          transparent
          opacity={0.05}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

/* ============================================
   VINYL RECORD COMPONENT
   Disque vinyl amélioré avec reflets magenta
   ============================================ */

interface VinylRecordProps {
  highlightedAlbum?: number;
}

function VinylRecord({ highlightedAlbum }: VinylRecordProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const baseRotationSpeed = useRef(0.5);

  useFrame((state) => {
    if (meshRef.current) {
      // Accelerate rotation when album is highlighted
      const targetSpeed = highlightedAlbum !== undefined ? 1.2 : 0.5;
      baseRotationSpeed.current += (targetSpeed - baseRotationSpeed.current) * 0.05;

      meshRef.current.rotation.z = state.clock.elapsedTime * baseRotationSpeed.current;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1 + Math.PI / 3;
    }
  });

  return (
    <group>
      {/* Main Vinyl Disc */}
      <Torus ref={meshRef} args={[3, 1.5, 2, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial
          color="#0a0a0f"
          roughness={0.2}
          metalness={0.9}
          emissive="#FF006E"
          emissiveIntensity={0.15}
          wireframe
        />
      </Torus>

      {/* Center Label - Magenta Glow */}
      <mesh position={[0, 0, -1]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#FF006E"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Inner core glow */}
      <mesh position={[0, 0, -1]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

/* ============================================
   AMBIENT GLOW ORBS
   Orbes pour la profondeur spatiale
   ============================================ */

interface AmbientOrbProps {
  position: [number, number, number];
  color: string;
  size: number;
  mouse: MouseState;
}

function AmbientOrb({ position, color, size, mouse }: AmbientOrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Pulse effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.6 + position[0]) * 0.25;
      meshRef.current.scale.setScalar(scale);

      // Mouse attraction
      meshRef.current.position.x = position[0] + mouse.x * 0.4;
      meshRef.current.position.y = position[1] + mouse.y * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.08}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/* ============================================
   SCENE CONTENT
   Assemblage de tous les éléments
   ============================================ */

interface SceneContentProps {
  mouse: MouseState;
  scrollProgress: number;
  highlightedAlbum?: number;
}

function SceneContent({ mouse, scrollProgress, highlightedAlbum }: SceneContentProps) {
  const { camera } = useThree();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Theme-aware colors
  const isDark = !mounted || resolvedTheme === 'dark';
  const bgColor = isDark ? '#0a0a0f' : '#2d2d42';  // Lighter cinematic blue-gray
  const fogColor = isDark ? '#0a0a0f' : '#353548';

  // Subtle camera movement based on mouse
  useFrame(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.position.x += (mouse.x * 1.5 - camera.position.x) * 0.02;
      camera.position.y += (mouse.y * 0.8 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);
    }
  });

  return (
    <>
      {/* Deep space background */}
      <color attach="background" args={[bgColor]} />
      <fog attach="fog" args={[fogColor, 8, 25]} />

      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} color="#FF006E" intensity={2} />
      <pointLight position={[-5, -3, 3]} color="#8B5CF6" intensity={1} />

      {/* Glow rings behind vinyl */}
      <GlowRing highlightedAlbum={highlightedAlbum} />

      {/* Sound particles */}
      <SoundParticles
        mouse={mouse}
        scrollProgress={scrollProgress}
        highlightedAlbum={highlightedAlbum}
      />

      {/* Main vinyl record */}
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.4}>
        <VinylRecord highlightedAlbum={highlightedAlbum} />
      </Float>

      {/* Ambient glow orbs for depth */}
      <AmbientOrb position={[-8, 4, -12]} color="#FF006E" size={2.5} mouse={mouse} />
      <AmbientOrb position={[9, -3, -10]} color="#8B5CF6" size={2} mouse={mouse} />
      <AmbientOrb position={[0, -5, -15]} color="#00F0FF" size={3} mouse={mouse} />
      <AmbientOrb position={[-10, -1, -18]} color="#FF006E" size={2.8} mouse={mouse} />
    </>
  );
}

/* ============================================
   MAIN COMPONENT
   ============================================ */

interface AlbumsSceneProps {
  highlightedAlbum?: number;
}

export default function AlbumsScene({ highlightedAlbum }: AlbumsSceneProps) {
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
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
      >
        <SceneContent
          mouse={mouse}
          scrollProgress={scrollProgress}
          highlightedAlbum={highlightedAlbum}
        />
      </Canvas>
    </div>
  );
}
