'use client';

import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

/* ============================================
   TYPES
   ============================================ */

interface MouseState {
  x: number;
  y: number;
}

/* ============================================
   STAR FIELD COMPONENT
   3000 particules distribuées en sphère
   ============================================ */

interface StarFieldProps {
  mouse: MouseState;
  scrollProgress: number;
}

function StarField({ mouse, scrollProgress }: StarFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 3000;
  const radius = 20;

  // Generate star positions and colors
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const white = new THREE.Color('#ffffff');
    const cyan = new THREE.Color('#00F0FF');
    const purple = new THREE.Color('#8B5CF6');
    const lime = new THREE.Color('#D5FF0A');

    for (let i = 0; i < count; i++) {
      // Distribute on sphere surface
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * (0.5 + Math.random() * 0.5);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Color distribution: 60% white, 15% cyan, 15% purple, 10% lime
      const colorChoice = Math.random();
      let color: THREE.Color;
      if (colorChoice < 0.6) {
        color = white;
      } else if (colorChoice < 0.75) {
        color = cyan;
      } else if (colorChoice < 0.9) {
        color = purple;
      } else {
        color = lime;
      }

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

    }

    return { positions, colors };
  }, []);

  // Twinkle effect - stored in ref for performance
  const twinkleOffset = useRef<Float32Array>(new Float32Array(count));
  const twinkleSpeed = useRef<Float32Array>(new Float32Array(count));

  useMemo(() => {
    for (let i = 0; i < count; i++) {
      twinkleOffset.current[i] = Math.random() * Math.PI * 2;
      twinkleSpeed.current[i] = 0.5 + Math.random() * 1.5;
    }
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      // Slow continuous rotation
      pointsRef.current.rotation.y += 0.0003;
      pointsRef.current.rotation.x += 0.0001;

      // Mouse influence on rotation
      pointsRef.current.rotation.x += (mouse.y * 0.1 - pointsRef.current.rotation.x) * 0.02;
      pointsRef.current.rotation.z += (mouse.x * 0.05 - pointsRef.current.rotation.z) * 0.02;

      // Scroll parallax - move stars closer/further
      pointsRef.current.position.z = scrollProgress * -5;

      // Update material opacity for twinkle effect
      const material = pointsRef.current.material as THREE.PointsMaterial;
      material.opacity = 0.7 + Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} colors={colors} stride={3}>
      <PointMaterial
        transparent
        vertexColors
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.8}
      />
    </Points>
  );
}

/* ============================================
   NEBULA COMPONENT
   Sphère centrale pulsante en purple
   ============================================ */

interface NebulaProps {
  mouse: MouseState;
}

function Nebula({ mouse }: NebulaProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerMeshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Pulse effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
      meshRef.current.scale.setScalar(scale);

      // Follow mouse subtly
      meshRef.current.position.x = mouse.x * 1.5;
      meshRef.current.position.y = mouse.y * 1;

      // Slow rotation
      meshRef.current.rotation.y += 0.001;
      meshRef.current.rotation.z += 0.0005;
    }

    if (innerMeshRef.current) {
      // Inner core pulses opposite
      const innerScale = 1 - Math.sin(state.clock.elapsedTime * 0.7) * 0.1;
      innerMeshRef.current.scale.setScalar(innerScale);
      innerMeshRef.current.rotation.y -= 0.002;
    }
  });

  return (
    <group>
      {/* Outer nebula glow */}
      <mesh ref={meshRef} position={[0, 0, -5]}>
        <sphereGeometry args={[4, 32, 32]} />
        <meshBasicMaterial
          color="#8B5CF6"
          transparent
          opacity={0.06}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Inner core */}
      <mesh ref={innerMeshRef} position={[0, 0, -5]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial
          color="#00F0FF"
          transparent
          opacity={0.03}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Lime accent core */}
      <mesh position={[0, 0, -5]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial
          color="#D5FF0A"
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

/* ============================================
   SHOOTING STAR COMPONENT
   Étoile filante avec trail effect
   ============================================ */

interface ShootingStarProps {
  onComplete: () => void;
}

function ShootingStar({ onComplete }: ShootingStarProps) {
  const groupRef = useRef<THREE.Group>(null);
  const progressRef = useRef(0);
  const trailCount = 8;

  // Random start position and direction
  const startPos = useMemo(() => {
    const side = Math.random() > 0.5 ? 1 : -1;
    return new THREE.Vector3(side * 15, 8 + Math.random() * 4, -5 + Math.random() * 5);
  }, []);

  const endPos = useMemo(() => {
    return new THREE.Vector3(-startPos.x * 0.8, -4, startPos.z - 3);
  }, [startPos]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      progressRef.current += delta * 0.8;

      if (progressRef.current >= 1) {
        onComplete();
        return;
      }

      // Interpolate position
      const pos = new THREE.Vector3().lerpVectors(startPos, endPos, progressRef.current);
      groupRef.current.position.copy(pos);

      // Update trail positions
      groupRef.current.children.forEach((child, index) => {
        const mesh = child as THREE.Mesh;
        const trailProgress = Math.max(0, progressRef.current - index * 0.03);
        const trailPos = new THREE.Vector3().lerpVectors(startPos, endPos, trailProgress);
        mesh.position.copy(trailPos.sub(pos));

        // Fade trail
        const material = mesh.material as THREE.MeshBasicMaterial;
        material.opacity = (1 - index / trailCount) * (1 - progressRef.current) * 0.8;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main star */}
      <mesh>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial
          color="#D5FF0A"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Trail */}
      {Array.from({ length: trailCount }).map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.05 - i * 0.005, 6, 6]} />
          <meshBasicMaterial
            color={i < 3 ? '#D5FF0A' : '#00F0FF'}
            transparent
            opacity={0.6 - i * 0.08}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ============================================
   SHOOTING STAR MANAGER
   Gère le spawn des étoiles filantes
   ============================================ */

function ShootingStarManager() {
  const [stars, setStars] = useState<number[]>([]);
  const lastSpawnRef = useRef(0);

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime;

    // Spawn new star every 4-8 seconds
    if (elapsed - lastSpawnRef.current > 4 + Math.random() * 4 && stars.length < 2) {
      setStars((prev) => [...prev, Date.now()]);
      lastSpawnRef.current = elapsed;
    }
  });

  const handleComplete = useCallback((id: number) => {
    setStars((prev) => prev.filter((s) => s !== id));
  }, []);

  return (
    <>
      {stars.map((id) => (
        <ShootingStar key={id} onComplete={() => handleComplete(id)} />
      ))}
    </>
  );
}

/* ============================================
   CONSTELLATION COMPONENT
   Groupe d'étoiles connectées
   ============================================ */

interface ConstellationProps {
  position: [number, number, number];
  color: string;
  points: [number, number, number][];
  mouse: MouseState;
  isHighlighted?: boolean;
}

function Constellation({ position, color, points, mouse, isHighlighted = false }: ConstellationProps) {
  const groupRef = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  // Generate line geometry connecting points
  const linePositions = useMemo(() => {
    const positions: number[] = [];
    for (let i = 0; i < points.length - 1; i++) {
      positions.push(...points[i]);
      positions.push(...points[i + 1]);
    }
    return new Float32Array(positions);
  }, [points]);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating motion
      groupRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 0.3 + position[0]) * 0.3;

      // Mouse parallax
      groupRef.current.position.x = position[0] + mouse.x * 0.5;

      // Subtle rotation
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }

    if (linesRef.current) {
      const material = linesRef.current.material as THREE.LineBasicMaterial;
      material.opacity = isHighlighted ? 0.7 : 0.3 + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  const glowIntensity = isHighlighted ? 0.8 : 0.4;

  return (
    <group ref={groupRef} position={position}>
      {/* Star points */}
      {points.map((point, index) => (
        <mesh key={index} position={point}>
          <sphereGeometry args={[isHighlighted ? 0.12 : 0.08, 8, 8]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={glowIntensity}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}

      {/* Connection lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}

/* ============================================
   CONSTELLATION MANAGER
   Gère les 6 constellations représentant les services
   ============================================ */

interface ConstellationManagerProps {
  mouse: MouseState;
  highlightedIndex?: number;
}

function ConstellationManager({ mouse, highlightedIndex }: ConstellationManagerProps) {
  // 6 constellations with different shapes and positions
  const constellations = useMemo(
    () => [
      {
        position: [-8, 4, -8] as [number, number, number],
        color: '#D5FF0A',
        points: [
          [0, 0, 0],
          [0.8, 0.5, 0],
          [1.5, 0.2, 0],
          [2, 1, 0],
        ] as [number, number, number][],
      },
      {
        position: [7, 5, -10] as [number, number, number],
        color: '#00F0FF',
        points: [
          [0, 0, 0],
          [0.5, 0.8, 0],
          [0, 1.5, 0],
          [-0.5, 0.8, 0],
          [0, 0, 0],
        ] as [number, number, number][],
      },
      {
        position: [-6, -3, -7] as [number, number, number],
        color: '#8B5CF6',
        points: [
          [0, 0, 0],
          [1, 0.3, 0],
          [0.5, 1, 0],
          [1.2, 1.2, 0],
        ] as [number, number, number][],
      },
      {
        position: [9, -2, -9] as [number, number, number],
        color: '#D5FF0A',
        points: [
          [0, 0, 0],
          [0.6, 0.6, 0],
          [1.2, 0, 0],
        ] as [number, number, number][],
      },
      {
        position: [-10, 1, -12] as [number, number, number],
        color: '#00F0FF',
        points: [
          [0, 0, 0],
          [0.4, 0.9, 0],
          [0.9, 0.5, 0],
          [1.3, 1.1, 0],
          [0.7, 1.4, 0],
        ] as [number, number, number][],
      },
      {
        position: [5, 0, -6] as [number, number, number],
        color: '#8B5CF6',
        points: [
          [0, 0, 0],
          [0.7, 0.4, 0],
          [0.3, 1, 0],
        ] as [number, number, number][],
      },
    ],
    []
  );

  return (
    <>
      {constellations.map((constellation, index) => (
        <Constellation
          key={index}
          position={constellation.position}
          color={constellation.color}
          points={constellation.points}
          mouse={mouse}
          isHighlighted={highlightedIndex === index}
        />
      ))}
    </>
  );
}

/* ============================================
   COSMIC GLOW ORBS
   Orbes de profondeur pour l'ambiance
   ============================================ */

interface CosmicGlowOrbProps {
  position: [number, number, number];
  color: string;
  size: number;
  mouse: MouseState;
}

function CosmicGlowOrb({ position, color, size, mouse }: CosmicGlowOrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Pulse effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.8 + position[0]) * 0.2;
      meshRef.current.scale.setScalar(scale);

      // Mouse attraction
      meshRef.current.position.x = position[0] + mouse.x * 0.3;
      meshRef.current.position.y = position[1] + mouse.y * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.1}
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
  highlightedService?: number;
}

function SceneContent({ mouse, scrollProgress, highlightedService }: SceneContentProps) {
  const { camera } = useThree();

  // Subtle camera movement based on mouse
  useFrame(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.position.x += (mouse.x * 2 - camera.position.x) * 0.02;
      camera.position.y += (mouse.y * 1 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, -5);
    }
  });

  return (
    <>
      {/* Deep space background */}
      <color attach="background" args={['#050510']} />
      <fog attach="fog" args={['#050510', 15, 35]} />

      {/* Star field - main attraction */}
      <StarField mouse={mouse} scrollProgress={scrollProgress} />

      {/* Central nebula */}
      <Nebula mouse={mouse} />

      {/* Shooting stars */}
      <ShootingStarManager />

      {/* Constellations representing services */}
      <ConstellationManager mouse={mouse} highlightedIndex={highlightedService} />

      {/* Ambient glow orbs for depth */}
      <CosmicGlowOrb position={[-8, 5, -15]} color="#8B5CF6" size={3} mouse={mouse} />
      <CosmicGlowOrb position={[10, -3, -12]} color="#00F0FF" size={2.5} mouse={mouse} />
      <CosmicGlowOrb position={[0, -6, -18]} color="#D5FF0A" size={2} mouse={mouse} />
      <CosmicGlowOrb position={[-12, -2, -20]} color="#00F0FF" size={3.5} mouse={mouse} />
    </>
  );
}

/* ============================================
   MAIN COMPONENT
   ============================================ */

interface CosmosSceneProps {
  highlightedService?: number;
}

export default function CosmosScene({ highlightedService }: CosmosSceneProps) {
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
        camera={{ position: [0, 0, 12], fov: 60 }}
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
          highlightedService={highlightedService}
        />
      </Canvas>
    </div>
  );
}
