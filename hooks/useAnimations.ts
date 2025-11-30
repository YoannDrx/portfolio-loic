'use client';

import { useRef, useState, useEffect, useCallback, type RefObject } from 'react';
import {
  useMotionValue,
  useSpring,
  useInView,
} from 'framer-motion';
import type { MotionValue, SpringOptions } from 'framer-motion';

/* ============================================
   MOUSE POSITION HOOK
   ============================================ */

interface MousePosition {
  x: number;
  y: number;
}

/**
 * Hook to track mouse position (normalized or absolute)
 */
export function useMousePosition(normalized = false) {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (normalized) {
        setPosition({
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight,
        });
      } else {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [normalized]);

  return position;
}

/* ============================================
   MAGNETIC EFFECT HOOK
   ============================================ */

interface UseMagneticOptions {
  /** Strength of the magnetic effect (0-1) */
  strength?: number;
  /** Spring configuration */
  springConfig?: SpringOptions;
  /** Only activate on hover */
  hoverOnly?: boolean;
}

interface UseMagneticReturn {
  ref: RefObject<HTMLDivElement | null>;
  x: MotionValue<number>;
  y: MotionValue<number>;
  isHovered: boolean;
}

/**
 * Hook for magnetic hover effect on elements
 *
 * @example
 * ```tsx
 * const { ref, x, y } = useMagnetic({ strength: 0.3 });
 *
 * <motion.button ref={ref} style={{ x, y }}>
 *   Magnetic Button
 * </motion.button>
 * ```
 */
export function useMagnetic({
  strength = 0.3,
  springConfig = { stiffness: 150, damping: 15, mass: 0.1 },
  hoverOnly = true,
}: UseMagneticOptions = {}): UseMagneticReturn {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;

      if (hoverOnly && !isHovered) {
        x.set(0);
        y.set(0);
        return;
      }

      x.set(distanceX * strength);
      y.set(distanceY * strength);
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => {
      setIsHovered(false);
      x.set(0);
      y.set(0);
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [x, y, strength, hoverOnly, isHovered]);

  return { ref, x: springX, y: springY, isHovered };
}

/* ============================================
   3D CARD EFFECT HOOK
   ============================================ */

interface Use3DCardOptions {
  /** Maximum rotation in degrees */
  maxRotation?: number;
  /** Perspective value */
  perspective?: number;
  /** Scale on hover */
  scale?: number;
  /** Spring configuration */
  springConfig?: SpringOptions;
}

interface Use3DCardReturn {
  ref: RefObject<HTMLDivElement | null>;
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  scale: MotionValue<number>;
  isHovered: boolean;
  style: {
    rotateX: MotionValue<number>;
    rotateY: MotionValue<number>;
    scale: MotionValue<number>;
    transformPerspective: number;
  };
}

/**
 * Hook for 3D card tilt effect on hover
 *
 * @example
 * ```tsx
 * const { ref, style } = use3DCard({ maxRotation: 15 });
 *
 * <motion.div ref={ref} style={style}>
 *   3D Card Content
 * </motion.div>
 * ```
 */
export function use3DCard({
  maxRotation = 15,
  perspective = 1000,
  scale: scaleValue = 1.05,
  springConfig = { stiffness: 300, damping: 30 },
}: Use3DCardOptions = {}): Use3DCardReturn {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const rotateXValue = useMotionValue(0);
  const rotateYValue = useMotionValue(0);
  const scaleMotion = useMotionValue(1);

  const rotateX = useSpring(rotateXValue, springConfig);
  const rotateY = useSpring(rotateYValue, springConfig);
  const scale = useSpring(scaleMotion, springConfig);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovered) return;

      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const percentX = (e.clientX - centerX) / (rect.width / 2);
      const percentY = (e.clientY - centerY) / (rect.height / 2);

      rotateXValue.set(-percentY * maxRotation);
      rotateYValue.set(percentX * maxRotation);
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
      scaleMotion.set(scaleValue);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      rotateXValue.set(0);
      rotateYValue.set(0);
      scaleMotion.set(1);
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mousemove', handleMouseMove);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mousemove', handleMouseMove);
    };
  }, [rotateXValue, rotateYValue, scaleMotion, maxRotation, scaleValue, isHovered]);

  return {
    ref,
    rotateX,
    rotateY,
    scale,
    isHovered,
    style: {
      rotateX,
      rotateY,
      scale,
      transformPerspective: perspective,
    },
  };
}

/* ============================================
   MOUSE GLOW EFFECT HOOK
   ============================================ */

interface UseMouseGlowOptions {
  /** Size of the glow in pixels */
  size?: number;
  /** Color of the glow (CSS color) */
  color?: string;
  /** Opacity of the glow (0-1) */
  opacity?: number;
  /** Blur amount in pixels */
  blur?: number;
}

interface UseMouseGlowReturn {
  ref: RefObject<HTMLDivElement | null>;
  glowStyle: {
    background: string;
    opacity: number;
    left: number;
    top: number;
  };
  isHovered: boolean;
}

/**
 * Hook for glow effect that follows mouse cursor
 *
 * @example
 * ```tsx
 * const { ref, glowStyle, isHovered } = useMouseGlow({ color: '#00f0ff' });
 *
 * <div ref={ref} className="relative">
 *   {isHovered && (
 *     <div
 *       className="absolute pointer-events-none rounded-full"
 *       style={{
 *         ...glowStyle,
 *         width: 200,
 *         height: 200,
 *         transform: 'translate(-50%, -50%)',
 *         filter: 'blur(40px)',
 *       }}
 *     />
 *   )}
 *   Content
 * </div>
 * ```
 */
export function useMouseGlow({
  size = 200,
  color = 'rgba(0, 240, 255, 0.3)',
  opacity = 0.3,
  blur = 40,
}: UseMouseGlowOptions = {}): UseMouseGlowReturn {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mousemove', handleMouseMove);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const glowStyle = {
    background: `radial-gradient(circle at center, ${color}, transparent 70%)`,
    opacity: isHovered ? opacity : 0,
    left: position.x,
    top: position.y,
    width: size,
    height: size,
    filter: `blur(${blur}px)`,
  };

  return { ref, glowStyle, isHovered };
}

/* ============================================
   COUNT UP ANIMATION HOOK
   ============================================ */

interface UseCountUpOptions {
  /** Starting value */
  start?: number;
  /** Ending value */
  end: number;
  /** Duration in seconds */
  duration?: number;
  /** Decimal places */
  decimals?: number;
  /** Prefix (e.g., "$") */
  prefix?: string;
  /** Suffix (e.g., "+", "%") */
  suffix?: string;
  /** Only start when in view */
  startOnView?: boolean;
  /** Easing function */
  easing?: 'linear' | 'easeOut' | 'easeInOut';
}

interface UseCountUpReturn {
  ref: RefObject<HTMLSpanElement | null>;
  value: string;
  isComplete: boolean;
  reset: () => void;
}

/**
 * Hook for animated count-up numbers
 *
 * @example
 * ```tsx
 * const { ref, value } = useCountUp({ end: 100, suffix: '+' });
 *
 * <span ref={ref}>{value}</span>
 * ```
 */
export function useCountUp({
  start = 0,
  end,
  duration = 2,
  decimals = 0,
  prefix = '',
  suffix = '',
  startOnView = true,
  easing = 'easeOut',
}: UseCountUpOptions): UseCountUpReturn {
  const ref = useRef<HTMLSpanElement>(null);
  const [currentValue, setCurrentValue] = useState(start);
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const easingFunctions = {
    linear: (t: number) => t,
    easeOut: (t: number) => 1 - Math.pow(1 - t, 3),
    easeInOut: (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  };

  const reset = useCallback(() => {
    setCurrentValue(start);
    setIsComplete(false);
    setHasStarted(false);
  }, [start]);

  useEffect(() => {
    if (startOnView && !isInView) return;
    if (hasStarted) return;

    setHasStarted(true);
    const startTime = Date.now();
    const durationMs = duration * 1000;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const easedProgress = easingFunctions[easing](progress);

      const value = start + (end - start) * easedProgress;
      setCurrentValue(value);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsComplete(true);
      }
    };

    requestAnimationFrame(animate);
  }, [start, end, duration, easing, startOnView, isInView, hasStarted]);

  const formattedValue = `${prefix}${currentValue.toFixed(decimals)}${suffix}`;

  return { ref, value: formattedValue, isComplete, reset };
}

/* ============================================
   STAGGER CHILDREN HOOK
   ============================================ */

interface UseStaggerOptions {
  /** Delay between each child in seconds */
  staggerDelay?: number;
  /** Initial delay before first child */
  initialDelay?: number;
  /** Only trigger when in view */
  triggerOnView?: boolean;
}

/**
 * Hook for staggered animation delays
 *
 * @example
 * ```tsx
 * const { getDelay, isInView, ref } = useStagger({ staggerDelay: 0.1 });
 *
 * <div ref={ref}>
 *   {items.map((item, index) => (
 *     <motion.div
 *       key={item.id}
 *       initial={{ opacity: 0, y: 20 }}
 *       animate={isInView ? { opacity: 1, y: 0 } : {}}
 *       transition={{ delay: getDelay(index) }}
 *     >
 *       {item.content}
 *     </motion.div>
 *   ))}
 * </div>
 * ```
 */
export function useStagger({
  staggerDelay = 0.1,
  initialDelay = 0,
  triggerOnView = true,
}: UseStaggerOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const getDelay = useCallback(
    (index: number) => initialDelay + index * staggerDelay,
    [initialDelay, staggerDelay]
  );

  const shouldAnimate = triggerOnView ? isInView : true;

  return { ref, isInView, shouldAnimate, getDelay };
}

/* ============================================
   SCROLL VELOCITY HOOK
   ============================================ */

interface UseScrollVelocityReturn {
  velocity: number;
  direction: 'up' | 'down' | 'none';
}

/**
 * Hook to track scroll velocity and direction
 */
export function useScrollVelocity(): UseScrollVelocityReturn {
  const [velocity, setVelocity] = useState(0);
  const [direction, setDirection] = useState<'up' | 'down' | 'none'>('none');
  const lastScrollY = useRef(0);
  const lastTime = useRef(Date.now());

  useEffect(() => {
    const handleScroll = () => {
      const currentTime = Date.now();
      const currentScrollY = window.scrollY;

      const timeDelta = currentTime - lastTime.current;
      const scrollDelta = currentScrollY - lastScrollY.current;

      if (timeDelta > 0) {
        const newVelocity = Math.abs(scrollDelta / timeDelta) * 100;
        setVelocity(newVelocity);

        if (scrollDelta > 0) {
          setDirection('down');
        } else if (scrollDelta < 0) {
          setDirection('up');
        } else {
          setDirection('none');
        }
      }

      lastScrollY.current = currentScrollY;
      lastTime.current = currentTime;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { velocity, direction };
}

/* ============================================
   REDUCED MOTION HOOK
   ============================================ */

/**
 * Hook to detect user preference for reduced motion
 */
export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return reducedMotion;
}

/* ============================================
   INTERSECTION OBSERVER HOOK
   ============================================ */

interface UseIntersectionOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Hook for intersection observer with more control
 */
export function useIntersection({
  threshold = 0,
  rootMargin = '0px',
  triggerOnce = true,
}: UseIntersectionOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isCurrentlyIntersecting = entry.isIntersecting;

        if (triggerOnce) {
          if (isCurrentlyIntersecting && !hasIntersected) {
            setIsIntersecting(true);
            setHasIntersected(true);
          }
        } else {
          setIsIntersecting(isCurrentlyIntersecting);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce, hasIntersected]);

  return { ref, isIntersecting, hasIntersected };
}

/* ============================================
   TYPED TEXT HOOK
   ============================================ */

interface UseTypedTextOptions {
  /** Text to type */
  text: string;
  /** Speed in milliseconds per character */
  speed?: number;
  /** Delay before starting */
  delay?: number;
  /** Start when in view */
  startOnView?: boolean;
  /** Show cursor */
  showCursor?: boolean;
}

/**
 * Hook for typewriter text effect
 *
 * @example
 * ```tsx
 * const { displayText, isComplete, ref } = useTypedText({
 *   text: 'Hello World',
 *   speed: 50
 * });
 *
 * <span ref={ref}>{displayText}</span>
 * ```
 */
export function useTypedText({
  text,
  speed = 50,
  delay = 0,
  startOnView = true,
  showCursor = true,
}: UseTypedTextOptions) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (startOnView && !isInView) return;
    if (hasStarted) return;

    const startTimeout = setTimeout(() => {
      setHasStarted(true);
      let currentIndex = 0;

      const typeInterval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typeInterval);
          setIsComplete(true);
        }
      }, speed);

      return () => clearInterval(typeInterval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [text, speed, delay, startOnView, isInView, hasStarted]);

  const cursor = showCursor && !isComplete ? '|' : '';

  return { ref, displayText: displayText + cursor, isComplete };
}

/* ============================================
   EXPORT ALL HOOKS
   ============================================ */

export type {
  MousePosition,
  UseMagneticOptions,
  UseMagneticReturn,
  Use3DCardOptions,
  Use3DCardReturn,
  UseMouseGlowOptions,
  UseMouseGlowReturn,
  UseCountUpOptions,
  UseCountUpReturn,
  UseStaggerOptions,
  UseScrollVelocityReturn,
  UseIntersectionOptions,
  UseTypedTextOptions,
};
