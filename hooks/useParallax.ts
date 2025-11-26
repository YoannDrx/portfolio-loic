'use client';

import { useRef } from 'react';
import {
  useScroll,
  useTransform,
  useSpring,
} from 'framer-motion';
import type { MotionValue, SpringOptions } from 'framer-motion';
import type { RefObject } from 'react';

/* ============================================
   TYPES
   ============================================ */

type Direction = 'up' | 'down' | 'left' | 'right';
type ScrollOffset = 'start' | 'center' | 'end';

interface UseParallaxOptions {
  /** Parallax speed multiplier (0.1 = slow, 1 = same as scroll) */
  speed?: number;
  /** Direction of parallax movement */
  direction?: Direction;
  /** Scroll offset configuration */
  offset?: [`${ScrollOffset} ${ScrollOffset}`, `${ScrollOffset} ${ScrollOffset}`];
  /** Input range for transform (0 to 1) */
  inputRange?: [number, number];
  /** Apply spring smoothing */
  smooth?: boolean;
  /** Spring configuration */
  springConfig?: SpringOptions;
}

interface UseParallaxReturn {
  ref: RefObject<HTMLDivElement | null>;
  scrollYProgress: MotionValue<number>;
  transform: MotionValue<number>;
  style: { x: MotionValue<number> } | { y: MotionValue<number> };
}

/* ============================================
   MAIN HOOK
   ============================================ */

/**
 * Hook for creating parallax scroll effects
 *
 * @example
 * ```tsx
 * const { ref, style } = useParallax({ speed: 0.5 });
 *
 * <motion.div ref={ref} style={style}>
 *   Parallax content
 * </motion.div>
 * ```
 */
export function useParallax({
  speed = 0.5,
  direction = 'up',
  offset = ['start end', 'end start'],
  inputRange = [0, 1],
  smooth = true,
  springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 },
}: UseParallaxOptions = {}): UseParallaxReturn {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset,
  });

  // Calculate distance based on speed
  const distance = 100 * speed;

  // Determine output range based on direction
  const outputRange =
    direction === 'up' || direction === 'left'
      ? [0, -distance]
      : [-distance, 0];

  // Create transform value
  const rawTransform = useTransform(scrollYProgress, inputRange, outputRange);

  // Apply spring smoothing if enabled
  const transform = smooth
    ? useSpring(rawTransform, springConfig)
    : rawTransform;

  // Create style object based on direction
  const style =
    direction === 'left' || direction === 'right'
      ? { x: transform }
      : { y: transform };

  return {
    ref,
    scrollYProgress,
    transform,
    style,
  };
}

/* ============================================
   SIMPLIFIED HOOKS
   ============================================ */

/**
 * Simple vertical parallax (moves up as you scroll down)
 */
export function useParallaxY(speed = 0.5, smooth = true) {
  return useParallax({ speed, direction: 'up', smooth });
}

/**
 * Simple horizontal parallax (moves left as you scroll down)
 */
export function useParallaxX(speed = 0.5, smooth = true) {
  return useParallax({ speed, direction: 'left', smooth });
}

/**
 * Reverse vertical parallax (moves down as you scroll down)
 */
export function useParallaxYReverse(speed = 0.5, smooth = true) {
  return useParallax({ speed, direction: 'down', smooth });
}

/* ============================================
   SCROLL TRANSFORM HOOKS
   ============================================ */

interface UseScrollScaleOptions {
  /** Scale range [start, end] */
  scaleRange?: [number, number];
  /** Include opacity transition */
  withOpacity?: boolean;
  /** Scroll offset configuration */
  offset?: [`${ScrollOffset} ${ScrollOffset}`, `${ScrollOffset} ${ScrollOffset}`];
}

/**
 * Hook for scale transform on scroll
 *
 * @example
 * ```tsx
 * const { ref, scale, opacity } = useScrollScale();
 *
 * <motion.div ref={ref} style={{ scale, opacity }}>
 *   Scaling content
 * </motion.div>
 * ```
 */
export function useScrollScale({
  scaleRange = [0.8, 1],
  withOpacity = true,
  offset = ['start end', 'center center'],
}: UseScrollScaleOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset,
  });

  const scale = useTransform(scrollYProgress, [0, 1], scaleRange);
  const opacity = withOpacity
    ? useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1])
    : undefined;

  return { ref, scale, opacity, scrollYProgress };
}

/**
 * Hook for scale from larger (zoom out effect)
 */
export function useScrollScaleDown(scaleStart = 1.2) {
  return useScrollScale({ scaleRange: [scaleStart, 1] });
}

/* ============================================
   SCROLL ROTATE HOOKS
   ============================================ */

interface UseScrollRotateOptions {
  /** Rotation range in degrees [start, end] */
  degrees?: number;
  /** Rotation direction */
  direction?: 'clockwise' | 'counterclockwise';
  /** Scroll offset configuration */
  offset?: [`${ScrollOffset} ${ScrollOffset}`, `${ScrollOffset} ${ScrollOffset}`];
}

/**
 * Hook for rotation transform on scroll
 *
 * @example
 * ```tsx
 * const { ref, rotate } = useScrollRotate({ degrees: 15 });
 *
 * <motion.div ref={ref} style={{ rotate }}>
 *   Rotating content
 * </motion.div>
 * ```
 */
export function useScrollRotate({
  degrees = 10,
  direction = 'clockwise',
  offset = ['start end', 'end start'],
}: UseScrollRotateOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset,
  });

  const rotateRange =
    direction === 'clockwise' ? [-degrees, degrees] : [degrees, -degrees];

  const rotate = useTransform(scrollYProgress, [0, 1], rotateRange);

  return { ref, rotate, scrollYProgress };
}

/* ============================================
   SCROLL OPACITY HOOKS
   ============================================ */

interface UseScrollOpacityOptions {
  /** Opacity range [start, end] */
  opacityRange?: [number, number];
  /** Input progress range */
  inputRange?: [number, number];
  /** Scroll offset configuration */
  offset?: [`${ScrollOffset} ${ScrollOffset}`, `${ScrollOffset} ${ScrollOffset}`];
}

/**
 * Hook for opacity change on scroll (fade in)
 */
export function useScrollFadeIn({
  opacityRange = [0, 1],
  inputRange = [0, 0.5],
  offset = ['start end', 'center center'],
}: UseScrollOpacityOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset,
  });

  const opacity = useTransform(scrollYProgress, inputRange, opacityRange);

  return { ref, opacity, scrollYProgress };
}

/**
 * Hook for opacity change on scroll (fade out)
 */
export function useScrollFadeOut({
  opacityRange = [1, 0],
  inputRange = [0.5, 1],
  offset = ['center center', 'end start'],
}: UseScrollOpacityOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset,
  });

  const opacity = useTransform(scrollYProgress, inputRange, opacityRange);

  return { ref, opacity, scrollYProgress };
}

/* ============================================
   SCROLL PROGRESS HOOKS
   ============================================ */

/**
 * Hook for tracking scroll progress within an element
 */
export function useScrollProgress(
  offset: [`${ScrollOffset} ${ScrollOffset}`, `${ScrollOffset} ${ScrollOffset}`] = [
    'start end',
    'end start',
  ]
) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset,
  });

  // Smooth the progress with spring
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return { ref, progress: scrollYProgress, smoothProgress };
}

/**
 * Hook for tracking page scroll progress (0-1)
 */
export function usePageScrollProgress() {
  const { scrollYProgress } = useScroll();

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return { progress: scrollYProgress, smoothProgress };
}

/* ============================================
   COMBINED EFFECTS HOOKS
   ============================================ */

interface UseParallaxComplexOptions {
  /** Y axis parallax speed */
  ySpeed?: number;
  /** X axis parallax speed */
  xSpeed?: number;
  /** Rotation degrees */
  rotateDegrees?: number;
  /** Scale range */
  scaleRange?: [number, number];
  /** Include opacity */
  withOpacity?: boolean;
}

/**
 * Hook for complex combined parallax effects
 *
 * @example
 * ```tsx
 * const { ref, style } = useParallaxComplex({
 *   ySpeed: 0.3,
 *   rotateDegrees: 5,
 *   scaleRange: [0.95, 1],
 * });
 *
 * <motion.div ref={ref} style={style}>
 *   Complex parallax content
 * </motion.div>
 * ```
 */
export function useParallaxComplex({
  ySpeed = 0,
  xSpeed = 0,
  rotateDegrees = 0,
  scaleRange,
  withOpacity = false,
}: UseParallaxComplexOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Create transforms
  const y = ySpeed
    ? useTransform(scrollYProgress, [0, 1], [0, -100 * ySpeed])
    : undefined;
  const x = xSpeed
    ? useTransform(scrollYProgress, [0, 1], [0, -100 * xSpeed])
    : undefined;
  const rotate = rotateDegrees
    ? useTransform(scrollYProgress, [0, 1], [-rotateDegrees, rotateDegrees])
    : undefined;
  const scale = scaleRange
    ? useTransform(scrollYProgress, [0, 1], scaleRange)
    : undefined;
  const opacity = withOpacity
    ? useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
    : undefined;

  // Build style object
  const style: Record<string, MotionValue<number> | undefined> = {};
  if (y) style.y = y;
  if (x) style.x = x;
  if (rotate) style.rotate = rotate;
  if (scale) style.scale = scale;
  if (opacity) style.opacity = opacity;

  return { ref, style, scrollYProgress };
}

/* ============================================
   LAYER PRESETS
   ============================================ */

/**
 * Preset for background layer (slow movement)
 */
export function useParallaxBackground() {
  return useParallax({ speed: 0.2, direction: 'up' });
}

/**
 * Preset for midground layer (medium movement)
 */
export function useParallaxMidground() {
  return useParallax({ speed: 0.5, direction: 'up' });
}

/**
 * Preset for foreground layer (fast movement)
 */
export function useParallaxForeground() {
  return useParallax({ speed: 0.8, direction: 'down' });
}

/**
 * Preset for floating elements
 */
export function useParallaxFloat() {
  return useParallaxComplex({
    ySpeed: 0.3,
    rotateDegrees: 3,
    scaleRange: [0.98, 1.02],
  });
}
