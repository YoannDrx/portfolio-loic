'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { useTheme } from 'next-themes';
import * as THREE from 'three';

/* ============================================
   ETHEREAL CINEMA - LAYERED PARALLAX SPACE

   6 couches de profondeur avec parallax multi-niveaux
   Attraction magnétique des particules
   Camera vivante avec drift autonome
   ============================================ */

/* ============================================
   PERLIN NOISE
   ============================================ */

function noise(x: number, y: number, z: number): number {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  const Z = Math.floor(z) & 255;
  x -= Math.floor(x);
  y -= Math.floor(y);
  z -= Math.floor(z);
  const u = x * x * (3 - 2 * x);
  const v = y * y * (3 - 2 * y);
  const w = z * z * (3 - 2 * z);
  const A = (X + Y * 57 + Z * 131) * 0.0001;
  return Math.sin(A * 1000 + u * 10 + v * 20 + w * 30) * 0.5 + 0.5;
}

/* ============================================
   SEEDED RANDOM - Pour éviter les erreurs d'hydratation
   ============================================ */

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

/* ============================================
   TYPES
   ============================================ */

interface MouseState {
  x: number;
  y: number;
  smoothX: number;
  smoothY: number;
  velocityX: number;
  velocityY: number;
}

interface LayerProps {
  mouse: MouseState;
  scrollProgress: number;
}

/* ============================================
   LAYER 1: NEBULA FOG (z: -25)
   Background atmosphérique très subtil
   ============================================ */

function NebulaFog({ mouse }: LayerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialsRef = useRef<THREE.MeshBasicMaterial[]>([]);

  // Positions déterministes pour éviter l'erreur d'hydratation
  const nebulaPositions = useMemo(
    () => [
      { x: -12 + 1.2, y: -3, z: 0 },
      { x: -4 + 2.4, y: 3, z: -2 },
      { x: 4 + 0.8, y: -3, z: -4 },
      { x: 12 + 3.2, y: 3, z: -6 },
    ],
    []
  );

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (groupRef.current) {
      // Parallax très léger (0.1x)
      groupRef.current.position.x = mouse.smoothX * 0.8;
      groupRef.current.position.y = mouse.smoothY * 0.5;

      // Animation drift ultra-lent
      groupRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        mesh.position.x += Math.sin(time * 0.05 + i) * 0.002;
        mesh.position.y += Math.cos(time * 0.03 + i * 0.5) * 0.001;

        // Color shift subtil cyan -> purple
        if (materialsRef.current[i]) {
          const hue = 0.52 + Math.sin(time * 0.02 + i * 0.3) * 0.08;
          materialsRef.current[i].color.setHSL(hue, 0.8, 0.5);
        }
      });
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -25]}>
      {nebulaPositions.map((pos, i) => {
        const material = new THREE.MeshBasicMaterial({
          color: new THREE.Color().setHSL(0.52, 0.8, 0.5),
          transparent: true,
          opacity: 0.04 + i * 0.01,
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide,
        });
        materialsRef.current[i] = material;

        return (
          <mesh
            key={i}
            position={[pos.x, pos.y, pos.z]}
            rotation={[0, 0, i * 0.3]}
          >
            <planeGeometry args={[25 + i * 5, 18 + i * 3]} />
            <primitive object={material} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ============================================
   LAYER 2: DISTANT BOKEH (z: -18)
   Grandes sphères floues lointaines
   ============================================ */

function DistantBokeh({ mouse }: LayerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bokehData = useMemo(() => {
    return [...Array(18)].map((_, i) => ({
      x: (seededRandom(i * 7 + 1) - 0.5) * 35,
      y: (seededRandom(i * 7 + 2) - 0.5) * 25,
      z: -15 - seededRandom(i * 7 + 3) * 8,
      size: 1.5 + seededRandom(i * 7 + 4) * 3,
      phase: seededRandom(i * 7 + 5) * Math.PI * 2,
      speed: 0.2 + seededRandom(i * 7 + 6) * 0.3,
      color: seededRandom(i * 7 + 7) > 0.7 ? '#8B5CF6' : '#00F0FF',
    }));
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (groupRef.current) {
      // Parallax 0.2x
      groupRef.current.position.x = mouse.smoothX * 1.6;
      groupRef.current.position.y = mouse.smoothY * 1.2;

      groupRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        const data = bokehData[i];

        // Float animation
        mesh.position.y = data.y + Math.sin(time * data.speed + data.phase) * 0.8;

        // Pulse opacity
        const material = mesh.material as THREE.MeshBasicMaterial;
        material.opacity = 0.06 + Math.sin(time * 0.5 + data.phase) * 0.03;

        // Subtle scale breathing
        const scale = data.size * (1 + Math.sin(time * 0.3 + data.phase) * 0.1);
        mesh.scale.setScalar(scale);
      });
    }
  });

  return (
    <group ref={groupRef}>
      {bokehData.map((data, i) => (
        <mesh key={i} position={[data.x, data.y, data.z]}>
          <circleGeometry args={[data.size, 32]} />
          <meshBasicMaterial
            color={data.color}
            transparent
            opacity={0.07}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ============================================
   LAYER 3: FINE DUST (z: -12)
   3000 particules ultra-fines
   ============================================ */

function FineDust({ mouse, scrollProgress }: LayerProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 3000;

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (seededRandom(i * 6 + 100) - 0.5) * 40;
      positions[i * 3 + 1] = (seededRandom(i * 6 + 101) - 0.5) * 30;
      positions[i * 3 + 2] = -8 - seededRandom(i * 6 + 102) * 10;

      velocities[i * 3] = (seededRandom(i * 6 + 103) - 0.5) * 0.3;
      velocities[i * 3 + 1] = (seededRandom(i * 6 + 104) - 0.5) * 0.2;
      velocities[i * 3 + 2] = (seededRandom(i * 6 + 105) - 0.5) * 0.1;
    }

    return { positions, velocities };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.elapsedTime;
    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      let x = posArray[i3];
      let y = posArray[i3 + 1];
      let z = posArray[i3 + 2];

      // Perlin drift
      const nx = noise(x * 0.05, y * 0.05, time * 0.1) - 0.5;
      const ny = noise(x * 0.05 + 100, y * 0.05, time * 0.1) - 0.5;

      x += (velocities[i3] * 0.1 + nx * 0.05) * 0.5;
      y += (velocities[i3 + 1] * 0.08 + ny * 0.04) * 0.5;
      z += velocities[i3 + 2] * 0.02;

      // Wrap around
      if (x < -20) x = 20;
      if (x > 20) x = -20;
      if (y < -15) y = 15;
      if (y > 15) y = -15;

      posArray[i3] = x;
      posArray[i3 + 1] = y;
      posArray[i3 + 2] = z;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Parallax 0.4x
    pointsRef.current.position.x = mouse.smoothX * 3.2;
    pointsRef.current.position.y = mouse.smoothY * 2.4;
    pointsRef.current.position.z = scrollProgress * -2;
  });

  return (
    <Points ref={pointsRef} positions={positions}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.015}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.25}
      />
    </Points>
  );
}

/* ============================================
   LAYER 4: ETHEREAL RAYS (z: -8)
   Rayons doux avec breathing animation
   ============================================ */

function EtherealRays({ mouse }: LayerProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (groupRef.current) {
      // Parallax 0.5x
      groupRef.current.position.x = mouse.smoothX * 4;
      groupRef.current.position.y = mouse.smoothY * 3;

      // Mouse influence on rotation
      groupRef.current.rotation.z = mouse.smoothX * 0.03;

      groupRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        const material = mesh.material as THREE.MeshBasicMaterial;

        // Breathing scale
        const breathScale = 1 + Math.sin(time * 0.4 + i * 0.5) * 0.05;
        mesh.scale.x = breathScale;
        mesh.scale.y = breathScale;

        // Sway rotation
        mesh.rotation.z = Math.sin(time * 0.2 + i * 0.3) * 0.03;

        // Subtle flicker
        material.opacity = 0.03 + Math.sin(time * 2 + i * 0.7) * 0.01 + Math.random() * 0.005;
      });
    }
  });

  return (
    <group ref={groupRef} position={[12, 8, -8]} rotation={[0, 0, Math.PI * 0.7]}>
      {[...Array(7)].map((_, i) => (
        <mesh key={i} position={[0, -12, i * 0.3]} rotation={[0, 0, (i - 3) * 0.08]}>
          <coneGeometry args={[6 + i * 0.5, 25, 32, 1, true]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.03}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ============================================
   LAYER 5: LIGHT MOTES (z: -3)
   Particules avec ATTRACTION MAGNÉTIQUE
   ============================================ */

function LightMotes({ mouse }: LayerProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 250;

  const { positions, basePositions, velocities, sparkles } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const basePositions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const sparkles = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const x = (seededRandom(i * 4 + 500) - 0.5) * 30;
      const y = (seededRandom(i * 4 + 501) - 0.5) * 22;
      const z = -1 - seededRandom(i * 4 + 502) * 5;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      basePositions[i * 3] = x;
      basePositions[i * 3 + 1] = y;
      basePositions[i * 3 + 2] = z;

      velocities[i * 3] = 0;
      velocities[i * 3 + 1] = 0;
      velocities[i * 3 + 2] = 0;

      sparkles[i] = seededRandom(i * 4 + 503);
    }

    return { positions, basePositions, velocities, sparkles };
  }, []);

  const velocitiesRef = useRef(velocities);
  const sparklesRef = useRef(sparkles);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.elapsedTime;
    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const vel = velocitiesRef.current;
    const spark = sparklesRef.current;

    // Mouse 3D position (avec parallax 0.7x)
    const mouse3D = {
      x: mouse.smoothX * 5.6,
      y: mouse.smoothY * 4.2,
      z: -3,
    };

    const mouseSpeed = Math.sqrt(mouse.velocityX ** 2 + mouse.velocityY ** 2);
    const INFLUENCE_RADIUS = 5;
    const ORBIT_RADIUS = 1.5;
    const ATTRACTION_STRENGTH = 0.15;
    const ORBIT_SPEED = 0.08;
    const RELEASE_THRESHOLD = 0.02;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = posArray[i3];
      const y = posArray[i3 + 1];
      const z = posArray[i3 + 2];

      const dx = mouse3D.x - x;
      const dy = mouse3D.y - y;
      const dz = mouse3D.z - z;
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (distance < INFLUENCE_RADIUS && distance > 0.1) {
        // Attraction force
        const attractionForce = (INFLUENCE_RADIUS - distance) / INFLUENCE_RADIUS;
        const dirX = dx / distance;
        const dirY = dy / distance;

        vel[i3] += dirX * attractionForce * ATTRACTION_STRENGTH;
        vel[i3 + 1] += dirY * attractionForce * ATTRACTION_STRENGTH;

        // Orbit effect when close
        if (distance < ORBIT_RADIUS) {
          vel[i3] += -dirY * ORBIT_SPEED;
          vel[i3 + 1] += dirX * ORBIT_SPEED;
        }

        // Release with inertia when mouse moves fast
        if (mouseSpeed > RELEASE_THRESHOLD) {
          vel[i3] += mouse.velocityX * 2;
          vel[i3 + 1] += mouse.velocityY * 2;
        }
      }

      // Return to base position
      const baseX = basePositions[i3];
      const baseY = basePositions[i3 + 1];
      vel[i3] += (baseX - x) * 0.003;
      vel[i3 + 1] += (baseY - y) * 0.003;

      // Float animation
      vel[i3 + 1] += Math.sin(time * 0.5 + i * 0.1) * 0.001;

      // Damping
      vel[i3] *= 0.96;
      vel[i3 + 1] *= 0.96;
      vel[i3 + 2] *= 0.96;

      // Apply velocity
      posArray[i3] += vel[i3];
      posArray[i3 + 1] += vel[i3 + 1];
      posArray[i3 + 2] += vel[i3 + 2];

      // Sparkle animation
      spark[i] = (spark[i] + 0.01 + Math.random() * 0.005) % 1;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Global parallax applied via group would interfere with attraction
    // So we keep individual particle positions relative to mouse
  });

  return (
    <Points ref={pointsRef} positions={positions}>
      <PointMaterial
        transparent
        color="#00F0FF"
        size={0.05}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.6}
      />
    </Points>
  );
}

/* ============================================
   LAYER 6: CLOSE BOKEH (z: +2)
   Très grandes sphères floues au premier plan
   ============================================ */

function CloseBokeh({ mouse }: LayerProps) {
  const groupRef = useRef<THREE.Group>(null);

  const bokehData = useMemo(() => {
    return [...Array(6)].map((_, i) => ({
      x: (seededRandom(i * 5 + 800) - 0.5) * 30,
      y: (seededRandom(i * 5 + 801) - 0.5) * 20,
      z: 1 + seededRandom(i * 5 + 802) * 3,
      size: 4 + seededRandom(i * 5 + 803) * 6,
      phase: seededRandom(i * 5 + 804) * Math.PI * 2,
    }));
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (groupRef.current) {
      // Parallax 1.0x (full movement)
      groupRef.current.position.x = mouse.smoothX * 8;
      groupRef.current.position.y = mouse.smoothY * 6;

      groupRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        const data = bokehData[i];
        const material = mesh.material as THREE.MeshBasicMaterial;

        // Very slow drift
        mesh.position.x = data.x + Math.sin(time * 0.1 + data.phase) * 2;
        mesh.position.y = data.y + Math.cos(time * 0.08 + data.phase) * 1.5;

        // Fade based on position (edge = more visible)
        const edgeFactor = Math.abs(mesh.position.x) / 20;
        material.opacity = 0.02 + edgeFactor * 0.02;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {bokehData.map((data, i) => (
        <mesh key={i} position={[data.x, data.y, data.z]}>
          <circleGeometry args={[data.size, 32]} />
          <meshBasicMaterial
            color="#00F0FF"
            transparent
            opacity={0.025}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ============================================
   INTERACTIVE CAMERA
   Drift autonome + suivi souris
   ============================================ */

function InteractiveCamera({ mouse }: { mouse: MouseState }) {
  const { camera } = useThree();
  const basePosition = useRef(new THREE.Vector3(0, 0, 12));

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (camera instanceof THREE.PerspectiveCamera) {
      // Autonomous drift
      const driftX = Math.sin(time * 0.1) * 0.3;
      const driftY = Math.cos(time * 0.15) * 0.2;

      // Mouse response (smooth)
      const targetX = basePosition.current.x + driftX + mouse.smoothX * 1.5;
      const targetY = basePosition.current.y + driftY + mouse.smoothY * 1;

      camera.position.x += (targetX - camera.position.x) * 0.02;
      camera.position.y += (targetY - camera.position.y) * 0.02;

      // Look slightly toward mouse
      camera.lookAt(mouse.smoothX * 0.5, mouse.smoothY * 0.3, -5);
    }
  });

  return null;
}

/* ============================================
   SCENE CONTENT
   ============================================ */

function SceneContent({ mouse, scrollProgress }: { mouse: MouseState; scrollProgress: number }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Theme-aware colors
  const isDark = !mounted || resolvedTheme === 'dark';
  const bgColor = isDark ? '#050508' : '#252535';  // Lighter cinematic variant
  const fogColor = isDark ? '#050508' : '#303042';

  const layerProps = { mouse, scrollProgress };

  return (
    <>
      <color attach="background" args={[bgColor]} />
      <fog attach="fog" args={[fogColor, 15, 45]} />

      {/* Layer 1: Nebula Fog (far background) */}
      <NebulaFog {...layerProps} />

      {/* Layer 2: Distant Bokeh */}
      <DistantBokeh {...layerProps} />

      {/* Layer 3: Fine Dust */}
      <FineDust {...layerProps} />

      {/* Layer 4: Ethereal Rays */}
      <EtherealRays {...layerProps} />

      {/* Layer 5: Light Motes (interactive) */}
      <LightMotes {...layerProps} />

      {/* Layer 6: Close Bokeh (foreground) */}
      <CloseBokeh {...layerProps} />

      {/* Interactive Camera */}
      <InteractiveCamera mouse={mouse} />
    </>
  );
}

/* ============================================
   MAIN COMPONENT
   ============================================ */

interface CinemaSceneProps {
  highlightedVideo?: number;
}

export default function CinemaScene({ highlightedVideo: _highlightedVideo }: CinemaSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mouse, setMouse] = useState<MouseState>({
    x: 0.5,
    y: 0.5,
    smoothX: 0,
    smoothY: 0,
    velocityX: 0,
    velocityY: 0,
  });

  const prevMouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    let animationFrame: number;

    const updateMouse = () => {
      setMouse((prev) => {
        const targetX = (prev.x - 0.5) * 2;
        const targetY = -(prev.y - 0.5) * 2;

        const newSmoothX = prev.smoothX + (targetX - prev.smoothX) * 0.05;
        const newSmoothY = prev.smoothY + (targetY - prev.smoothY) * 0.05;

        return {
          ...prev,
          smoothX: newSmoothX,
          smoothY: newSmoothY,
          velocityX: (prev.x - prevMouseRef.current.x) * 0.5,
          velocityY: (prev.y - prevMouseRef.current.y) * 0.5,
        };
      });

      animationFrame = requestAnimationFrame(updateMouse);
    };

    animationFrame = requestAnimationFrame(updateMouse);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      prevMouseRef.current = { x: mouse.x, y: mouse.y };
      setMouse((prev) => ({
        ...prev,
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      }));
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouse.x, mouse.y]);

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
        camera={{ position: [0, 0, 12], fov: 50 }}
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
