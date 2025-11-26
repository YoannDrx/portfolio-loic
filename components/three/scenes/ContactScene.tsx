'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* ============================================
   CONSTANTS & HELPERS
   ============================================ */

const LIME = '#D5FF0A';
const LIME_BRIGHT = '#E8FF4A';
const CYAN = '#00F0FF';
const BACKGROUND = '#050508';

// Deterministic random to avoid hydration errors
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

// Lerp helper
function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/* ============================================
   MOUSE TRACKING HOOK
   ============================================ */

function useMouseTracking() {
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const smoothMouse = useRef({ x: 0.5, y: 0.5 });
  const velocity = useRef({ x: 0, y: 0 });
  const prevMouse = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX / window.innerWidth;
      mouse.current.y = e.clientY / window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return { mouse, smoothMouse, velocity, prevMouse };
}

/* ============================================
   ATOM CORE - Central Nucleus
   ============================================ */

interface AtomCoreProps {
  smoothMouse: React.MutableRefObject<{ x: number; y: number }>;
}

function AtomCore({ smoothMouse }: AtomCoreProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const innerGlowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (meshRef.current) {
      // Slow pulse animation
      const pulse = 1 + Math.sin(time * 0.5) * 0.05;
      meshRef.current.scale.setScalar(pulse);

      // Subtle rotation
      meshRef.current.rotation.y = time * 0.1;
      meshRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;

      // Breathing towards mouse (very subtle)
      const mouseX = (smoothMouse.current.x - 0.5) * 0.3;
      const mouseY = (smoothMouse.current.y - 0.5) * -0.2;
      meshRef.current.position.x = lerp(meshRef.current.position.x, mouseX, 0.02);
      meshRef.current.position.y = lerp(meshRef.current.position.y, mouseY, 0.02);
    }

    if (glowRef.current) {
      // Glow pulsing
      const glowPulse = 1 + Math.sin(time * 0.8) * 0.15;
      glowRef.current.scale.setScalar(glowPulse * 2.5);

      // Sync position with core
      if (meshRef.current) {
        glowRef.current.position.copy(meshRef.current.position);
      }
    }

    if (innerGlowRef.current) {
      const innerPulse = 1 + Math.sin(time * 1.2 + 1) * 0.1;
      innerGlowRef.current.scale.setScalar(innerPulse * 1.8);

      if (meshRef.current) {
        innerGlowRef.current.position.copy(meshRef.current.position);
      }
    }
  });

  return (
    <group>
      {/* Inner glow */}
      <mesh ref={innerGlowRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color={LIME_BRIGHT}
          transparent
          opacity={0.15}
          depthWrite={false}
        />
      </mesh>

      {/* Outer glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color={LIME}
          transparent
          opacity={0.08}
          depthWrite={false}
        />
      </mesh>

      {/* Core nucleus */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.8, 64, 64]} />
        <meshStandardMaterial
          color={LIME}
          emissive={LIME}
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.3}
        />
      </mesh>
    </group>
  );
}

/* ============================================
   ELECTRON - Single electron with trail
   ============================================ */

interface ElectronProps {
  orbitRadius: number;
  speed: number;
  phase: number;
  baseTiltX: number;
  baseTiltY: number;
  baseTiltZ: number;
  size: number;
  color: string;
  smoothMouse: React.MutableRefObject<{ x: number; y: number }>;
  corePosition: THREE.Vector3;
  orbitIndex: number;
}

function Electron({
  orbitRadius,
  speed,
  phase,
  baseTiltX,
  baseTiltY,
  baseTiltZ,
  size,
  color,
  smoothMouse,
  corePosition,
  orbitIndex,
}: ElectronProps) {
  const electronRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.Points>(null);
  const trailPositions = useRef<Float32Array>(new Float32Array(60 * 3)); // 20 trail points

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Constant speed - no mouse acceleration
    const angle = time * speed + phase;

    // Dynamic tilt based on mouse position (smooth and organic)
    const mouseInfluenceX = (smoothMouse.current.y - 0.5) * 0.6; // Mouse Y affects X tilt
    const mouseInfluenceY = (smoothMouse.current.x - 0.5) * 0.8; // Mouse X affects Y tilt

    // Each orbit has different sensitivity to mouse
    const sensitivity = 1 - orbitIndex * 0.2; // Inner orbits react more

    const dynamicTiltX = baseTiltX + mouseInfluenceX * sensitivity;
    const dynamicTiltY = baseTiltY + mouseInfluenceY * sensitivity;
    const dynamicTiltZ = baseTiltZ + mouseInfluenceX * 0.3 * sensitivity;

    // Create rotation matrix for tilted orbit
    const rotationMatrix = new THREE.Matrix4();
    rotationMatrix.makeRotationFromEuler(
      new THREE.Euler(dynamicTiltX, dynamicTiltY, dynamicTiltZ, 'XYZ')
    );

    // Base position on circle
    const basePos = new THREE.Vector3(
      Math.cos(angle) * orbitRadius,
      0,
      Math.sin(angle) * orbitRadius
    );

    // Apply rotation
    basePos.applyMatrix4(rotationMatrix);

    // Add core position offset
    basePos.add(corePosition);

    if (electronRef.current) {
      electronRef.current.position.copy(basePos);
    }

    if (glowRef.current) {
      glowRef.current.position.copy(basePos);
    }

    // Update trail
    if (trailRef.current) {
      const positions = trailPositions.current;

      // Shift all positions back
      for (let i = positions.length - 3; i >= 3; i -= 3) {
        positions[i] = positions[i - 3];
        positions[i + 1] = positions[i - 2];
        positions[i + 2] = positions[i - 1];
      }

      // Add new position at front
      positions[0] = basePos.x;
      positions[1] = basePos.y;
      positions[2] = basePos.z;

      trailRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const trailGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(trailPositions.current, 3)
    );
    return geometry;
  }, []);

  return (
    <group>
      {/* Trail */}
      <points ref={trailRef} geometry={trailGeometry}>
        <pointsMaterial
          color={color}
          size={size * 0.4}
          transparent
          opacity={0.4}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>

      {/* Electron */}
      <mesh ref={electronRef}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Electron glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[size * 2, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

/* ============================================
   ELECTRON ORBITS - All 3 orbits with electrons
   ============================================ */

interface ElectronOrbitsProps {
  smoothMouse: React.MutableRefObject<{ x: number; y: number }>;
  corePosition: THREE.Vector3;
}

function ElectronOrbits({ smoothMouse, corePosition }: ElectronOrbitsProps) {
  // Orbit configurations
  const orbits = useMemo(
    () => [
      // Orbit 1: Close, fast
      {
        radius: 3.5,
        electrons: 2,
        speed: 0.4,
        baseTiltX: 0.3,
        baseTiltY: 0,
        baseTiltZ: 0.2,
        size: 0.15,
        color: LIME_BRIGHT,
      },
      // Orbit 2: Medium
      {
        radius: 5.5,
        electrons: 3,
        speed: 0.25,
        baseTiltX: 0.1,
        baseTiltY: 0.8,
        baseTiltZ: 0,
        size: 0.18,
        color: LIME,
      },
      // Orbit 3: Far, slow
      {
        radius: 8,
        electrons: 4,
        speed: 0.15,
        baseTiltX: 0.5,
        baseTiltY: 0.3,
        baseTiltZ: 0.4,
        size: 0.2,
        color: CYAN,
      },
    ],
    []
  );

  return (
    <group>
      {orbits.map((orbit, orbitIndex) =>
        Array.from({ length: orbit.electrons }).map((_, electronIndex) => (
          <Electron
            key={`orbit-${orbitIndex}-electron-${electronIndex}`}
            orbitRadius={orbit.radius}
            speed={orbit.speed}
            phase={(electronIndex / orbit.electrons) * Math.PI * 2}
            baseTiltX={orbit.baseTiltX}
            baseTiltY={orbit.baseTiltY}
            baseTiltZ={orbit.baseTiltZ}
            size={orbit.size}
            color={orbit.color}
            smoothMouse={smoothMouse}
            corePosition={corePosition}
            orbitIndex={orbitIndex}
          />
        ))
      )}
    </group>
  );
}

/* ============================================
   ORBIT RINGS - Visual ring guides with dynamic tilt
   ============================================ */

interface OrbitRingsProps {
  smoothMouse: React.MutableRefObject<{ x: number; y: number }>;
}

function OrbitRings({ smoothMouse }: OrbitRingsProps) {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  const rings = useMemo(
    () => [
      { radius: 3.5, baseTiltX: 0.3, baseTiltY: 0, baseTiltZ: 0.2, opacity: 0.12 },
      { radius: 5.5, baseTiltX: 0.1, baseTiltY: 0.8, baseTiltZ: 0, opacity: 0.1 },
      { radius: 8, baseTiltX: 0.5, baseTiltY: 0.3, baseTiltZ: 0.4, opacity: 0.08 },
    ],
    []
  );

  useFrame(() => {
    const refs = [ring1Ref, ring2Ref, ring3Ref];

    // Dynamic tilt based on mouse position
    const mouseInfluenceX = (smoothMouse.current.y - 0.5) * 0.6;
    const mouseInfluenceY = (smoothMouse.current.x - 0.5) * 0.8;

    refs.forEach((ref, i) => {
      if (ref.current) {
        const ring = rings[i];
        const sensitivity = 1 - i * 0.2;

        const targetTiltX = ring.baseTiltX + mouseInfluenceX * sensitivity;
        const targetTiltY = ring.baseTiltY + mouseInfluenceY * sensitivity;
        const targetTiltZ = ring.baseTiltZ + mouseInfluenceX * 0.3 * sensitivity;

        // Smooth interpolation for organic movement
        ref.current.rotation.x = lerp(ref.current.rotation.x, targetTiltX, 0.03);
        ref.current.rotation.y = lerp(ref.current.rotation.y, targetTiltY, 0.03);
        ref.current.rotation.z = lerp(ref.current.rotation.z, targetTiltZ, 0.03);
      }
    });

    // Follow core breathing
    if (groupRef.current) {
      const mouseX = (smoothMouse.current.x - 0.5) * 0.3;
      const mouseY = (smoothMouse.current.y - 0.5) * -0.2;
      groupRef.current.position.x = lerp(groupRef.current.position.x, mouseX, 0.02);
      groupRef.current.position.y = lerp(groupRef.current.position.y, mouseY, 0.02);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={ring1Ref}>
        <torusGeometry args={[rings[0].radius, 0.015, 8, 128]} />
        <meshBasicMaterial
          color={LIME}
          transparent
          opacity={rings[0].opacity}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[rings[1].radius, 0.015, 8, 128]} />
        <meshBasicMaterial
          color={LIME}
          transparent
          opacity={rings[1].opacity}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={ring3Ref}>
        <torusGeometry args={[rings[2].radius, 0.015, 8, 128]} />
        <meshBasicMaterial
          color={CYAN}
          transparent
          opacity={rings[2].opacity}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* ============================================
   ENERGY FIELD - Reactive outer sphere
   ============================================ */

interface EnergyFieldProps {
  smoothMouse: React.MutableRefObject<{ x: number; y: number }>;
}

function EnergyField({ smoothMouse }: EnergyFieldProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Custom shader for energy field with noise
  const shaderData = useMemo(
    () => ({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uColor: { value: new THREE.Color(LIME) },
      },
      vertexShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        varying vec3 vNormal;
        varying vec3 vPosition;

        // Simplex noise function
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

        float snoise(vec3 v) {
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i  = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          i = mod289(i);
          vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
          float n_ = 0.142857142857;
          vec3 ns = n_ * D.wyz - D.xzx;
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);
          vec4 x = x_ *ns.x + ns.yyyy;
          vec4 y = y_ *ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
          p0 *= norm.x;
          p1 *= norm.y;
          p2 *= norm.z;
          p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }

        void main() {
          vNormal = normal;
          vPosition = position;

          // Noise displacement
          float noise = snoise(position * 0.3 + uTime * 0.1);
          vec3 displaced = position + normal * noise * 0.5;

          // Mouse attraction
          vec3 mousePos = vec3((uMouse.x - 0.5) * 15.0, (uMouse.y - 0.5) * -10.0, 0.0);
          float distToMouse = distance(displaced, mousePos);
          if (distToMouse < 6.0) {
            vec3 toMouse = normalize(mousePos - displaced);
            float attraction = (6.0 - distToMouse) / 6.0;
            displaced += toMouse * attraction * 1.5;
          }

          gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          // Fresnel effect
          vec3 viewDirection = normalize(cameraPosition - vPosition);
          float fresnel = pow(1.0 - abs(dot(viewDirection, vNormal)), 3.0);

          gl_FragColor = vec4(uColor, fresnel * 0.06);
        }
      `,
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uMouse.value.set(
        smoothMouse.current.x,
        smoothMouse.current.y
      );
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[12, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        {...shaderData}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* ============================================
   PULSE WAVES - Concentric waves from nucleus
   ============================================ */

function PulseWaves() {
  const wavesRef = useRef<THREE.Group>(null);
  const waveData = useRef<{ scale: number; opacity: number }[]>([
    { scale: 0, opacity: 0.08 },
    { scale: 5, opacity: 0.06 },
    { scale: 10, opacity: 0.04 },
  ]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (wavesRef.current) {
      wavesRef.current.children.forEach((wave, i) => {
        const mesh = wave as THREE.Mesh;
        const data = waveData.current[i];

        // Expand wave
        data.scale += 0.015;
        data.opacity = Math.max(0, 0.08 - data.scale * 0.005);

        // Reset wave when it gets too big
        if (data.scale > 16) {
          data.scale = 0;
          data.opacity = 0.08;
        }

        mesh.scale.setScalar(data.scale);
        (mesh.material as THREE.MeshBasicMaterial).opacity = data.opacity;
      });
    }
  });

  return (
    <group ref={wavesRef}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.9, 1, 64]} />
          <meshBasicMaterial
            color={LIME}
            transparent
            opacity={0.08}
            depthWrite={false}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ============================================
   AMBIENT PARTICLES - Background star field
   ============================================ */

interface AmbientParticlesProps {
  smoothMouse: React.MutableRefObject<{ x: number; y: number }>;
}

function AmbientParticles({ smoothMouse }: AmbientParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 500;

  const { positions, colors, scales, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const velocities = new Float32Array(count * 3);

    const limeColor = new THREE.Color(LIME);
    const cyanColor = new THREE.Color(CYAN);
    const whiteColor = new THREE.Color('#ffffff');

    for (let i = 0; i < count; i++) {
      // Distribute in a sphere
      const radius = 15 + seededRandom(i * 123) * 15;
      const theta = seededRandom(i * 456) * Math.PI * 2;
      const phi = Math.acos(2 * seededRandom(i * 789) - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Colors: 70% white, 20% lime, 10% cyan
      const colorRand = seededRandom(i * 321);
      let color;
      if (colorRand < 0.7) color = whiteColor;
      else if (colorRand < 0.9) color = limeColor;
      else color = cyanColor;

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      scales[i] = 0.5 + seededRandom(i * 654) * 1.5;

      // Random drift velocity
      velocities[i * 3] = (seededRandom(i * 111) - 0.5) * 0.01;
      velocities[i * 3 + 1] = (seededRandom(i * 222) - 0.5) * 0.01;
      velocities[i * 3 + 2] = (seededRandom(i * 333) - 0.5) * 0.01;
    }

    return { positions, colors, scales, velocities };
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (pointsRef.current) {
      const posArray = pointsRef.current.geometry.attributes.position
        .array as Float32Array;

      for (let i = 0; i < count; i++) {
        // Slow drift with Perlin-like movement
        const driftX = Math.sin(time * 0.1 + i * 0.1) * 0.005;
        const driftY = Math.cos(time * 0.08 + i * 0.15) * 0.005;
        const driftZ = Math.sin(time * 0.12 + i * 0.08) * 0.005;

        posArray[i * 3] += velocities[i * 3] + driftX;
        posArray[i * 3 + 1] += velocities[i * 3 + 1] + driftY;
        posArray[i * 3 + 2] += velocities[i * 3 + 2] + driftZ;

        // Light repulsion from mouse
        const mouseX = (smoothMouse.current.x - 0.5) * 20;
        const mouseY = (smoothMouse.current.y - 0.5) * -15;
        const dx = posArray[i * 3] - mouseX;
        const dy = posArray[i * 3 + 1] - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 5) {
          const repulsion = (5 - dist) / 5 * 0.05;
          posArray[i * 3] += (dx / dist) * repulsion;
          posArray[i * 3 + 1] += (dy / dist) * repulsion;
        }

        // Keep particles in bounds
        const maxDist = 30;
        const currentDist = Math.sqrt(
          posArray[i * 3] ** 2 +
            posArray[i * 3 + 1] ** 2 +
            posArray[i * 3 + 2] ** 2
        );
        if (currentDist > maxDist) {
          const scale = maxDist / currentDist;
          posArray[i * 3] *= scale;
          posArray[i * 3 + 1] *= scale;
          posArray[i * 3 + 2] *= scale;
        }
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true;

      // Twinkle effect via size
      const sizes = pointsRef.current.geometry.attributes.size
        .array as Float32Array;
      for (let i = 0; i < count; i++) {
        sizes[i] = scales[i] * (0.8 + Math.sin(time * 2 + i) * 0.2);
      }
      pointsRef.current.geometry.attributes.size.needsUpdate = true;
    }
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(scales, 1));
    return geo;
  }, [positions, colors, scales]);

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.6}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

/* ============================================
   SIGNAL PARTICLES - Traveling from nucleus
   ============================================ */

function SignalParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const frameCount = useRef(0);
  const count = 40;

  const { positions, lifetimes, speeds, directions } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const lifetimes = new Float32Array(count);
    const speeds = new Float32Array(count);
    const directions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Start at nucleus
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;

      lifetimes[i] = seededRandom(i * 999) * 100;
      speeds[i] = 0.05 + seededRandom(i * 888) * 0.1;

      // Random direction
      const theta = seededRandom(i * 777) * Math.PI * 2;
      const phi = Math.acos(2 * seededRandom(i * 666) - 1);
      directions[i * 3] = Math.sin(phi) * Math.cos(theta);
      directions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta);
      directions[i * 3 + 2] = Math.cos(phi);
    }

    return { positions, lifetimes, speeds, directions };
  }, []);

  useFrame(() => {
    frameCount.current++;

    if (pointsRef.current) {
      const posArray = pointsRef.current.geometry.attributes.position
        .array as Float32Array;

      for (let i = 0; i < count; i++) {
        lifetimes[i]++;

        // Move outward
        posArray[i * 3] += directions[i * 3] * speeds[i];
        posArray[i * 3 + 1] += directions[i * 3 + 1] * speeds[i];
        posArray[i * 3 + 2] += directions[i * 3 + 2] * speeds[i];

        // Reset when too far
        const dist = Math.sqrt(
          posArray[i * 3] ** 2 +
            posArray[i * 3 + 1] ** 2 +
            posArray[i * 3 + 2] ** 2
        );

        if (dist > 15 || lifetimes[i] > 200) {
          // Reset to nucleus with new direction (using frame-based seed)
          posArray[i * 3] = 0;
          posArray[i * 3 + 1] = 0;
          posArray[i * 3 + 2] = 0;
          lifetimes[i] = 0;

          // Use frame count + particle index for deterministic randomness
          const seed = frameCount.current * 100 + i;
          const theta = seededRandom(seed * 777) * Math.PI * 2;
          const phi = Math.acos(2 * seededRandom(seed * 666) - 1);
          directions[i * 3] = Math.sin(phi) * Math.cos(theta);
          directions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta);
          directions[i * 3 + 2] = Math.cos(phi);
        }
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color={LIME_BRIGHT}
        size={0.12}
        transparent
        opacity={0.7}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

/* ============================================
   INTERACTIVE CAMERA - With drift and parallax
   ============================================ */

interface InteractiveCameraProps {
  smoothMouse: React.MutableRefObject<{ x: number; y: number }>;
}

function InteractiveCamera({ smoothMouse }: InteractiveCameraProps) {
  const { camera } = useThree();
  const basePosition = useRef(new THREE.Vector3(0, 0, 18));

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Autonomous drift
    const driftX = Math.sin(time * 0.1) * 0.5;
    const driftY = Math.cos(time * 0.08) * 0.3;

    // Mouse parallax (subtle)
    const mouseX = (smoothMouse.current.x - 0.5) * 2;
    const mouseY = (smoothMouse.current.y - 0.5) * -1.5;

    // Combined position
    camera.position.x = lerp(
      camera.position.x,
      basePosition.current.x + driftX + mouseX,
      0.02
    );
    camera.position.y = lerp(
      camera.position.y,
      basePosition.current.y + driftY + mouseY,
      0.02
    );

    // Always look at center
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/* ============================================
   MAIN SCENE CONTENT
   ============================================ */

function SceneContent() {
  const { mouse, smoothMouse, velocity, prevMouse } = useMouseTracking();
  const corePosition = useRef(new THREE.Vector3(0, 0, 0));

  // Update smooth mouse and velocity
  useFrame(() => {
    // Update velocity
    velocity.current.x = mouse.current.x - prevMouse.current.x;
    velocity.current.y = mouse.current.y - prevMouse.current.y;

    // Store previous
    prevMouse.current.x = mouse.current.x;
    prevMouse.current.y = mouse.current.y;

    // Smooth interpolation
    smoothMouse.current.x = lerp(smoothMouse.current.x, mouse.current.x, 0.03);
    smoothMouse.current.y = lerp(smoothMouse.current.y, mouse.current.y, 0.03);

    // Update core position for electrons to follow
    corePosition.current.x = (smoothMouse.current.x - 0.5) * 0.3;
    corePosition.current.y = (smoothMouse.current.y - 0.5) * -0.2;
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.1} />
      <pointLight
        position={[0, 0, 0]}
        color={LIME}
        intensity={2}
        distance={30}
      />
      <pointLight
        position={[0, 0, -10]}
        color={CYAN}
        intensity={0.5}
        distance={20}
      />

      {/* Camera controller */}
      <InteractiveCamera smoothMouse={smoothMouse} />

      {/* Energy Field (background layer) */}
      <EnergyField smoothMouse={smoothMouse} />

      {/* Ambient particles */}
      <AmbientParticles smoothMouse={smoothMouse} />

      {/* Pulse waves */}
      <PulseWaves />

      {/* Orbit rings */}
      <OrbitRings smoothMouse={smoothMouse} />

      {/* Electrons */}
      <ElectronOrbits smoothMouse={smoothMouse} corePosition={corePosition.current} />

      {/* Signal particles */}
      <SignalParticles />

      {/* Atom core (foreground) */}
      <AtomCore smoothMouse={smoothMouse} />
    </>
  );
}

/* ============================================
   MAIN COMPONENT
   ============================================ */

export default function ContactScene() {
  return (
    <div className="w-full h-full absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 18], fov: 45 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
      >
        <color attach="background" args={[BACKGROUND]} />
        <fog attach="fog" args={[BACKGROUND, 15, 35]} />
        <SceneContent />
      </Canvas>
    </div>
  );
}
