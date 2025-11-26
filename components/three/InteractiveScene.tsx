'use client';

import { useRef, useEffect, useState, createContext, useContext } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useScroll } from 'framer-motion';
import * as THREE from 'three';
import type { ReactNode } from 'react';

/* ============================================
   TYPES
   ============================================ */

interface MouseState {
  x: number; // -1 to 1
  y: number; // -1 to 1
  isActive: boolean;
}

interface ScrollState {
  progress: number; // 0 to 1
  velocity: number;
  direction: 'up' | 'down' | 'none';
}

interface InteractiveContextValue {
  mouse: MouseState;
  scroll: ScrollState;
  isHovered: boolean;
}

interface InteractiveSceneProps {
  children: ReactNode;
  /** Mouse influence strength (0-1) */
  mouseInfluence?: number;
  /** Scroll influence strength (0-1) */
  scrollInfluence?: number;
  /** Camera position */
  cameraPosition?: [number, number, number];
  /** Camera FOV */
  fov?: number;
  /** Background color */
  backgroundColor?: string;
  /** Enable fog */
  fog?: { color: string; near: number; far: number };
  /** ClassName for container */
  className?: string;
  /** Click effect type */
  clickEffect?: 'pulse' | 'ripple' | 'none';
}

/* ============================================
   CONTEXT
   ============================================ */

const InteractiveContext = createContext<InteractiveContextValue>({
  mouse: { x: 0, y: 0, isActive: false },
  scroll: { progress: 0, velocity: 0, direction: 'none' },
  isHovered: false,
});

export function useInteractive() {
  return useContext(InteractiveContext);
}

/* ============================================
   MOUSE TRACKER COMPONENT
   ============================================ */

interface MouseTrackerProps {
  influence: number;
  onMouseUpdate: (mouse: MouseState) => void;
}

function MouseTracker({ influence, onMouseUpdate }: MouseTrackerProps) {
  const { size, camera } = useThree();
  const targetMouse = useRef({ x: 0, y: 0 });
  const currentMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position to -1 to 1
      targetMouse.current = {
        x: ((e.clientX / size.width) * 2 - 1) * influence,
        y: (-(e.clientY / size.height) * 2 + 1) * influence,
      };
    };

    const handleMouseLeave = () => {
      targetMouse.current = { x: 0, y: 0 };
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [size, influence]);

  useFrame(() => {
    // Smooth interpolation
    currentMouse.current.x += (targetMouse.current.x - currentMouse.current.x) * 0.05;
    currentMouse.current.y += (targetMouse.current.y - currentMouse.current.y) * 0.05;

    onMouseUpdate({
      x: currentMouse.current.x,
      y: currentMouse.current.y,
      isActive: Math.abs(targetMouse.current.x) > 0.01 || Math.abs(targetMouse.current.y) > 0.01,
    });

    // Optional: Subtle camera movement based on mouse
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.position.x += (currentMouse.current.x * 0.5 - camera.position.x) * 0.02;
      camera.position.y += (currentMouse.current.y * 0.3 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);
    }
  });

  return null;
}

/* ============================================
   CLICK EFFECT COMPONENT
   ============================================ */

interface ClickEffectProps {
  type: 'pulse' | 'ripple';
  position: THREE.Vector3 | null;
  onComplete: () => void;
}

function ClickEffect({ type, position, onComplete }: ClickEffectProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [scale, setScale] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useFrame((_, delta) => {
    if (!meshRef.current || !position) return;

    const speed = type === 'pulse' ? 3 : 2;
    const newScale = scale + delta * speed;
    const newOpacity = Math.max(0, 1 - newScale / 2);

    setScale(newScale);
    setOpacity(newOpacity);

    if (newOpacity <= 0) {
      onComplete();
    }
  });

  if (!position) return null;

  return (
    <mesh ref={meshRef} position={position}>
      {type === 'pulse' ? (
        <sphereGeometry args={[scale * 0.5, 32, 32]} />
      ) : (
        <ringGeometry args={[scale * 0.3, scale * 0.5, 32]} />
      )}
      <meshBasicMaterial
        color="#00f0ff"
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/* ============================================
   SCENE CONTENT WRAPPER
   ============================================ */

interface SceneContentProps {
  children: ReactNode;
  mouseInfluence: number;
  clickEffect: 'pulse' | 'ripple' | 'none';
  scrollState: ScrollState;
  backgroundColor?: string;
  fog?: { color: string; near: number; far: number };
}

function SceneContent({
  children,
  mouseInfluence,
  clickEffect,
  scrollState,
  backgroundColor,
  fog,
}: SceneContentProps) {
  const [mouse, setMouse] = useState<MouseState>({ x: 0, y: 0, isActive: false });
  const [isHovered, setIsHovered] = useState(false);
  const [clickPosition, setClickPosition] = useState<THREE.Vector3 | null>(null);
  const { gl } = useThree();

  // Handle click effects
  useEffect(() => {
    if (clickEffect === 'none') return;

    const handleClick = (e: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      setClickPosition(new THREE.Vector3(x * 5, y * 3, 0));
    };

    gl.domElement.addEventListener('click', handleClick);
    return () => gl.domElement.removeEventListener('click', handleClick);
  }, [gl, clickEffect]);

  // Handle hover state
  useEffect(() => {
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    gl.domElement.addEventListener('mouseenter', handleMouseEnter);
    gl.domElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      gl.domElement.removeEventListener('mouseenter', handleMouseEnter);
      gl.domElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [gl]);

  return (
    <InteractiveContext.Provider value={{ mouse, scroll: scrollState, isHovered }}>
      {/* Background color */}
      {backgroundColor && <color attach="background" args={[backgroundColor]} />}

      {/* Fog */}
      {fog && <fog attach="fog" args={[fog.color, fog.near, fog.far]} />}

      {/* Mouse tracker */}
      {mouseInfluence > 0 && (
        <MouseTracker influence={mouseInfluence} onMouseUpdate={setMouse} />
      )}

      {/* Click effect */}
      {clickEffect !== 'none' && clickPosition && (
        <ClickEffect
          type={clickEffect}
          position={clickPosition}
          onComplete={() => setClickPosition(null)}
        />
      )}

      {/* Scene children */}
      {children}
    </InteractiveContext.Provider>
  );
}

/* ============================================
   MAIN COMPONENT
   ============================================ */

export default function InteractiveScene({
  children,
  mouseInfluence = 0.5,
  scrollInfluence = 0.5,
  cameraPosition = [0, 0, 10],
  fov = 45,
  backgroundColor = '#0a0a0f',
  fog,
  className = 'w-full h-full absolute inset-0',
  clickEffect = 'none',
}: InteractiveSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scroll, setScroll] = useState<ScrollState>({
    progress: 0,
    velocity: 0,
    direction: 'none',
  });

  // Track page scroll
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    let lastProgress = 0;
    let lastTime = Date.now();

    const unsubscribe = scrollYProgress.on('change', (latest) => {
      const currentTime = Date.now();
      const timeDelta = currentTime - lastTime;
      const progressDelta = latest - lastProgress;

      const velocity = timeDelta > 0 ? Math.abs(progressDelta / timeDelta) * 1000 : 0;
      const direction = progressDelta > 0 ? 'down' : progressDelta < 0 ? 'up' : 'none';

      setScroll({
        progress: latest * scrollInfluence,
        velocity,
        direction,
      });

      lastProgress = latest;
      lastTime = currentTime;
    });

    return () => unsubscribe();
  }, [scrollYProgress, scrollInfluence]);

  return (
    <div ref={containerRef} className={className}>
      <Canvas
        camera={{ position: cameraPosition, fov }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
      >
        <SceneContent
          mouseInfluence={mouseInfluence}
          clickEffect={clickEffect}
          scrollState={scroll}
          backgroundColor={backgroundColor}
          fog={fog}
        >
          {children}
        </SceneContent>
      </Canvas>
    </div>
  );
}

/* ============================================
   UTILITY HOOKS FOR SCENE CHILDREN
   ============================================ */

/**
 * Hook to get mouse-influenced rotation for meshes
 */
export function useMouseRotation(strength = 1) {
  const { mouse } = useInteractive();
  const rotationRef = useRef({ x: 0, y: 0 });

  useFrame(() => {
    rotationRef.current.x += (mouse.y * strength * 0.5 - rotationRef.current.x) * 0.05;
    rotationRef.current.y += (mouse.x * strength * 0.5 - rotationRef.current.y) * 0.05;
  });

  return rotationRef;
}

/**
 * Hook to get mouse-influenced position for meshes
 */
export function useMousePosition(strength = 1) {
  const { mouse } = useInteractive();
  const positionRef = useRef({ x: 0, y: 0, z: 0 });

  useFrame(() => {
    positionRef.current.x += (mouse.x * strength - positionRef.current.x) * 0.05;
    positionRef.current.y += (mouse.y * strength - positionRef.current.y) * 0.05;
  });

  return positionRef;
}

/**
 * Hook to get scroll-influenced value
 */
export function useScrollValue(min: number, max: number) {
  const { scroll } = useInteractive();
  return min + (max - min) * scroll.progress;
}

/* ============================================
   EXPORTS
   ============================================ */

export { InteractiveContext };
export type { InteractiveSceneProps, MouseState, ScrollState, InteractiveContextValue };
