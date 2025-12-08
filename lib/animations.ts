import type { Variants, Transition, TargetAndTransition } from 'framer-motion';

/* ============================================
   TRANSITIONS
   ============================================ */

export const transitions = {
  /** Springy, bouncy feel */
  spring: {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  } as Transition,

  /** Smooth, elegant motion */
  smooth: {
    duration: 0.5,
    ease: [0.25, 0.4, 0.25, 1],
  } as Transition,

  /** Very smooth with longer duration */
  smoothSlow: {
    duration: 0.8,
    ease: [0.25, 0.4, 0.25, 1],
  } as Transition,

  /** Bouncy spring */
  bounce: {
    type: 'spring',
    stiffness: 400,
    damping: 10,
  } as Transition,

  /** Gentle spring */
  gentle: {
    type: 'spring',
    stiffness: 200,
    damping: 25,
  } as Transition,

  /** Quick and snappy */
  fast: {
    duration: 0.2,
    ease: 'easeInOut',
  } as Transition,

  /** Standard duration */
  normal: {
    duration: 0.3,
    ease: 'easeInOut',
  } as Transition,

  /** Slow and deliberate */
  slow: {
    duration: 0.5,
    ease: 'easeOut',
  } as Transition,

  /** Very slow, dramatic */
  slower: {
    duration: 0.7,
    ease: 'easeOut',
  } as Transition,

  /** Slowest, for hero elements */
  slowest: {
    duration: 1,
    ease: [0.22, 1, 0.36, 1],
  } as Transition,
} as const;

/* ============================================
   ENTRANCE VARIANTS
   ============================================ */

/** Simple fade in */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitions.smooth,
  },
};

/** Fade in from bottom */
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
};

/** Fade in from top */
export const fadeInDown: Variants = {
  hidden: {
    opacity: 0,
    y: -30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
};

/** Fade in from left */
export const fadeInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.smooth,
  },
};

/** Fade in from right */
export const fadeInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.smooth,
  },
};

/** Fade in with scale */
export const fadeInScale: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.spring,
  },
};

/** Scale up from smaller */
export const scaleUp: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.spring,
  },
};

/** Scale down from larger */
export const scaleDown: Variants = {
  hidden: {
    opacity: 0,
    scale: 1.1,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.smooth,
  },
};

/** Fade in with blur */
export const blur: Variants = {
  hidden: {
    opacity: 0,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: transitions.smooth,
  },
};

/** Fade in with rotation */
export const rotate: Variants = {
  hidden: {
    opacity: 0,
    rotate: -10,
  },
  visible: {
    opacity: 1,
    rotate: 0,
    transition: transitions.spring,
  },
};

/** Slide in from left */
export const slideInLeft: Variants = {
  hidden: {
    x: -100,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: transitions.smooth,
  },
};

/** Slide in from right */
export const slideInRight: Variants = {
  hidden: {
    x: 100,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: transitions.smooth,
  },
};

/** Slide in from bottom */
export const slideInUp: Variants = {
  hidden: {
    y: 100,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: transitions.smooth,
  },
};

/** Slide in from top */
export const slideInDown: Variants = {
  hidden: {
    y: -100,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: transitions.smooth,
  },
};

/* ============================================
   HOVER VARIANTS
   ============================================ */

/** Scale up on hover */
export const hoverScale: TargetAndTransition = {
  scale: 1.05,
  transition: transitions.spring,
};

/** Scale up slightly on hover */
export const hoverScaleSmall: TargetAndTransition = {
  scale: 1.02,
  transition: transitions.spring,
};

/** Lift up on hover */
export const hoverLift: TargetAndTransition = {
  y: -8,
  transition: transitions.smooth,
};

/** Lift up slightly on hover */
export const hoverLiftSmall: TargetAndTransition = {
  y: -4,
  transition: transitions.smooth,
};

/** Primary glow on hover */
export const hoverGlow: TargetAndTransition = {
  boxShadow: '0 0 30px rgba(213, 255, 10, 0.6)',
  transition: transitions.smooth,
};

/** Subtle glow on hover */
export const hoverGlowSubtle: TargetAndTransition = {
  boxShadow: '0 0 20px rgba(213, 255, 10, 0.3)',
  transition: transitions.smooth,
};

/** Intense glow on hover */
export const hoverGlowIntense: TargetAndTransition = {
  boxShadow: '0 0 50px rgba(213, 255, 10, 0.8)',
  transition: transitions.smooth,
};

/** Emerald glow on hover */
export const hoverGlowEmerald: TargetAndTransition = {
  boxShadow: '0 0 30px rgba(0, 193, 139, 0.6)',
  transition: transitions.smooth,
};

/** Scale and lift combined */
export const hoverScaleLift: TargetAndTransition = {
  scale: 1.03,
  y: -4,
  transition: transitions.spring,
};

/* ============================================
   TAP VARIANTS
   ============================================ */

/** Scale down on tap */
export const tapScale: TargetAndTransition = {
  scale: 0.95,
  transition: transitions.fast,
};

/** Subtle scale down on tap */
export const tapScaleSmall: TargetAndTransition = {
  scale: 0.98,
  transition: transitions.fast,
};

/* ============================================
   STAGGER CONTAINERS
   ============================================ */

/** Container for staggered children */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

/** Fast stagger container */
export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

/** Slow stagger container */
export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

/** Standard stagger item */
export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
};

/** Stagger item with scale */
export const staggerItemScale: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.spring,
  },
};

/** Stagger item from left */
export const staggerItemLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.smooth,
  },
};

/** Stagger item from right */
export const staggerItemRight: Variants = {
  hidden: {
    opacity: 0,
    x: 20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.smooth,
  },
};

/* ============================================
   PAGE TRANSITIONS
   ============================================ */

/** Standard page transition */
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: transitions.fast,
  },
};

/** Fade page transition */
export const pageTransitionFade: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: transitions.smooth,
  },
  exit: {
    opacity: 0,
    transition: transitions.fast,
  },
};

/** Scale page transition */
export const pageTransitionScale: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: transitions.spring,
  },
  exit: {
    opacity: 0,
    scale: 1.05,
    transition: transitions.fast,
  },
};

/* ============================================
   MODAL / DIALOG VARIANTS
   ============================================ */

/** Modal backdrop */
export const modalBackdrop: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: transitions.fast,
  },
  exit: {
    opacity: 0,
    transition: transitions.fast,
  },
};

/** Modal content */
export const modalContent: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: transitions.spring,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: transitions.fast,
  },
};

/** Slide up modal (mobile-friendly) */
export const modalSlideUp: Variants = {
  hidden: {
    opacity: 0,
    y: '100%',
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.spring,
  },
  exit: {
    opacity: 0,
    y: '100%',
    transition: transitions.fast,
  },
};

/* ============================================
   MENU / DROPDOWN VARIANTS
   ============================================ */

/** Dropdown menu */
export const dropdownMenu: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: -10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: transitions.fast,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: { duration: 0.1 },
  },
};

/** Sidebar menu */
export const sidebarMenu: Variants = {
  hidden: {
    x: -300,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: transitions.smooth,
  },
  exit: {
    x: -300,
    opacity: 0,
    transition: transitions.fast,
  },
};

/* ============================================
   TEXT ANIMATIONS
   ============================================ */

/** Letter by letter reveal */
export const letterReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

/** Word by word reveal container */
export const wordRevealContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

/** Word reveal item */
export const wordRevealItem: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    rotateX: -90,
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: transitions.spring,
  },
};

/* ============================================
   HERO ANIMATIONS
   ============================================ */

/** Hero title animation */
export const heroTitle: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ...transitions.smoothSlow,
      delay: 0.2,
    },
  },
};

/** Hero subtitle animation */
export const heroSubtitle: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ...transitions.smooth,
      delay: 0.4,
    },
  },
};

/** Hero CTA animation */
export const heroCTA: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      ...transitions.spring,
      delay: 0.6,
    },
  },
};

/** Hero image animation */
export const heroImage: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      ...transitions.smoothSlow,
      delay: 0.3,
    },
  },
};

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

/**
 * Create custom stagger variants
 */
export function createStaggerVariants(
  staggerDelay = 0.1,
  childVariant: Variants = staggerItem
) {
  return {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay,
          delayChildren: staggerDelay,
        },
      },
    } as Variants,
    item: childVariant,
  };
}

/**
 * Create delayed variant
 */
export function withDelay(variant: Variants, delay: number): Variants {
  return {
    ...variant,
    visible: {
      ...(variant.visible as object),
      transition: {
        ...((variant.visible as { transition?: Transition })?.transition || {}),
        delay,
      },
    },
  };
}

/**
 * Create variant with custom transition
 */
export function withTransition(
  variant: Variants,
  transition: Transition
): Variants {
  return {
    ...variant,
    visible: {
      ...(variant.visible as object),
      transition,
    },
  };
}

/**
 * Viewport settings for scroll animations
 */
export const viewportOnce = {
  once: true,
  margin: '-100px',
};

export const viewportAlways = {
  once: false,
  margin: '-100px',
};

export const viewportEager = {
  once: true,
  margin: '0px',
};

/* ============================================
   PRESET COMBINATIONS
   ============================================ */

/** Card animation preset */
export const cardPreset = {
  initial: 'hidden',
  whileInView: 'visible',
  viewport: viewportOnce,
  variants: fadeInUp,
  whileHover: hoverScaleLift,
  whileTap: tapScaleSmall,
};

/** Button animation preset */
export const buttonPreset = {
  whileHover: hoverScale,
  whileTap: tapScale,
};

/** Section animation preset */
export const sectionPreset = {
  initial: 'hidden',
  whileInView: 'visible',
  viewport: viewportOnce,
  variants: fadeInUp,
};

/** Grid animation preset */
export const gridPreset = {
  initial: 'hidden',
  whileInView: 'visible',
  viewport: viewportOnce,
  variants: staggerContainer,
};

/* ============================================
   IMMERSIVE ANIMATIONS
   ============================================ */

/** Scroll reveal with 3D rotation */
export const scrollReveal3D: Variants = {
  hidden: {
    opacity: 0,
    y: 100,
    rotateX: -15,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.33, 1, 0.68, 1],
    },
  },
};

/** Scroll reveal with blur effect */
export const scrollRevealBlur: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
    filter: 'blur(20px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.7,
      ease: [0.25, 0.4, 0.25, 1],
    },
  },
};

/** Card 3D perspective variants */
export const card3D: Variants = {
  rest: {
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    z: 0,
  },
  hover: {
    scale: 1.05,
    z: 50,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 17,
    },
  },
};

/** Floating animation for background elements */
export const floatingElement: Variants = {
  initial: {
    y: 0,
    x: 0,
    scale: 1,
    opacity: 0.3,
  },
  animate: {
    y: [-20, 20, -20],
    x: [-10, 10, -10],
    scale: [1, 1.1, 1],
    opacity: [0.3, 0.5, 0.3],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/** Glow pulse animation */
export const glowPulse: Variants = {
  initial: {
    boxShadow: '0 0 20px rgba(213, 255, 10, 0.3)',
  },
  animate: {
    boxShadow: [
      '0 0 20px rgba(213, 255, 10, 0.3)',
      '0 0 40px rgba(213, 255, 10, 0.6)',
      '0 0 20px rgba(213, 255, 10, 0.3)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/** Text glitch effect */
export const glitchText: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
    },
  },
  glitch: {
    x: [0, -5, 5, -3, 3, 0],
    opacity: [1, 0.8, 1, 0.9, 1],
    transition: {
      duration: 0.3,
    },
  },
};

/** Particle burst variants */
export const particleBurst: Variants = {
  hidden: {
    scale: 0,
    opacity: 1,
  },
  visible: {
    scale: [0, 1.5, 2],
    opacity: [1, 0.5, 0],
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

/** Magnetic button effect base */
export const magneticButton: Variants = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 17,
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 17,
    },
  },
};

/** Hero parallax container */
export const heroParallax: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/** Section title dramatic reveal */
export const sectionTitleReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 100,
    skewY: 5,
  },
  visible: {
    opacity: 1,
    y: 0,
    skewY: 0,
    transition: {
      duration: 0.8,
      ease: [0.33, 1, 0.68, 1],
    },
  },
};

/** Underline draw animation */
export const underlineDraw: Variants = {
  hidden: {
    scaleX: 0,
    originX: 0,
  },
  visible: {
    scaleX: 1,
    transition: {
      duration: 0.6,
      delay: 0.3,
      ease: [0.33, 1, 0.68, 1],
    },
  },
};

/** Orbit animation for skills */
export const orbitAnimation: Variants = {
  initial: {
    rotate: 0,
  },
  animate: {
    rotate: 360,
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

/** Counter orbit (opposite direction) */
export const counterOrbitAnimation: Variants = {
  initial: {
    rotate: 0,
  },
  animate: {
    rotate: -360,
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

/** Timeline item reveal */
export const timelineItemReveal: Variants = {
  hidden: {
    opacity: 0,
    x: -50,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.4, 0.25, 1],
    },
  },
};

/** Stats counter container */
export const statsContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

/** Stats item with pop effect */
export const statsItem: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.5,
    y: 30,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
};

/** Immersive page transition */
export const immersivePageTransition: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    filter: 'blur(10px)',
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 1.05,
    filter: 'blur(10px)',
    transition: {
      duration: 0.3,
    },
  },
};

/** Neon glow colors for hover effects */
export const neonGlowColors = {
  lime: 'rgba(213, 255, 10, 0.6)',
  cyan: 'rgba(0, 240, 255, 0.6)',
  magenta: 'rgba(255, 0, 110, 0.6)',
  purple: 'rgba(181, 0, 255, 0.6)',
  emerald: 'rgba(0, 193, 139, 0.6)',
  teal: 'rgba(0, 153, 152, 0.6)',
} as const;

/** Create neon glow hover effect */
export function createNeonGlow(color: keyof typeof neonGlowColors): TargetAndTransition {
  return {
    boxShadow: `0 0 30px ${neonGlowColors[color]}`,
    transition: transitions.smooth,
  };
}

/* ============================================
   IMMERSIVE PRESETS
   ============================================ */

/** Immersive section preset */
export const immersiveSectionPreset = {
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, margin: '-100px' },
  variants: scrollReveal3D,
};

/** Immersive card preset */
export const immersiveCardPreset = {
  initial: 'rest',
  whileHover: 'hover',
  variants: card3D,
  style: { transformPerspective: 1000 },
};

/** Stats section preset */
export const statsPreset = {
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, margin: '-50px' },
  variants: statsContainer,
};

/** Timeline preset */
export const timelinePreset = {
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, margin: '-100px' },
  variants: timelineItemReveal,
};

/* ============================================
   ADMIN DASHBOARD ANIMATIONS
   ============================================ */

/** Admin card reveal with perspective */
export const adminCardReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    rotateX: -10,
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/** Admin sidebar item with glow */
export const adminSidebarItem: Variants = {
  rest: {
    x: 0,
    backgroundColor: 'transparent',
  },
  hover: {
    x: 4,
    backgroundColor: 'rgba(0, 240, 255, 0.05)',
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  active: {
    x: 0,
    backgroundColor: 'rgba(0, 240, 255, 0.1)',
  },
};

/** Admin table row animation */
export const adminTableRow: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.4, 0.25, 1],
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.2,
    },
  },
};

/** Admin table container with stagger */
export const adminTableContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.1,
    },
  },
};

/** Admin page transition with blur */
export const adminPageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    filter: 'blur(10px)',
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    filter: 'blur(10px)',
    transition: {
      duration: 0.3,
    },
  },
};

/** Admin success pulse animation */
export const adminSuccessPulse: Variants = {
  initial: {
    scale: 0,
    opacity: 0,
  },
  animate: {
    scale: [0, 1.2, 1],
    opacity: 1,
    transition: {
      duration: 0.5,
      times: [0, 0.6, 1],
      ease: 'easeOut',
    },
  },
};

/** Admin error shake animation */
export const adminErrorShake: Variants = {
  initial: {
    x: 0,
  },
  shake: {
    x: [-4, 4, -4, 4, -2, 2, 0],
    transition: {
      duration: 0.4,
      ease: 'easeInOut',
    },
  },
};

/** Admin KPI counter animation */
export const adminKPIReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  },
};

/** Admin KPI container stagger */
export const adminKPIContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

/** Admin command palette backdrop */
export const adminCommandBackdrop: Variants = {
  hidden: {
    opacity: 0,
    backdropFilter: 'blur(0px)',
  },
  visible: {
    opacity: 1,
    backdropFilter: 'blur(8px)',
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    backdropFilter: 'blur(0px)',
    transition: {
      duration: 0.15,
    },
  },
};

/** Admin command palette content */
export const adminCommandContent: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: -20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -20,
    transition: {
      duration: 0.15,
    },
  },
};

/** Admin command item */
export const adminCommandItem: Variants = {
  hidden: {
    opacity: 0,
    x: -10,
  },
  visible: {
    opacity: 1,
    x: 0,
  },
};

/** Admin toast notification */
export const adminToast: Variants = {
  initial: {
    opacity: 0,
    y: 50,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    x: 100,
    transition: {
      duration: 0.2,
    },
  },
};

/** Admin floating orb animation */
export const adminFloatingOrb: Variants = {
  initial: {
    opacity: 0.3,
    scale: 1,
  },
  animate: {
    opacity: [0.2, 0.4, 0.2],
    scale: [1, 1.1, 1],
    x: [0, 30, 0],
    y: [0, -20, 0],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/** Admin drag item */
export const adminDragItem: Variants = {
  rest: {
    scale: 1,
    boxShadow: '0 0 0 rgba(0, 240, 255, 0)',
  },
  dragging: {
    scale: 1.02,
    boxShadow: '0 0 30px rgba(0, 240, 255, 0.4)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
};

/** Admin bulk action bar */
export const adminBulkActionBar: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
};

/** Admin timeline item */
export const adminTimelineItem: Variants = {
  hidden: {
    opacity: 0,
    x: -30,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.4, 0.25, 1],
    },
  },
};

/** Admin timeline container */
export const adminTimelineContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

/** Admin form field animation */
export const adminFormField: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

/** Admin form container stagger */
export const adminFormContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

/** Admin header dropdown */
export const adminHeaderDropdown: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: -10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: {
      duration: 0.1,
    },
  },
};

/** Admin notification bell */
export const adminNotificationBell: Variants = {
  rest: {
    rotate: 0,
  },
  ring: {
    rotate: [0, 15, -15, 10, -10, 5, -5, 0],
    transition: {
      duration: 0.6,
      ease: 'easeInOut',
    },
  },
};

/** Admin neon glow colors for admin */
export const adminNeonColors = {
  cyan: 'rgba(0, 240, 255, 0.6)',
  lime: 'rgba(213, 255, 10, 0.6)',
  magenta: 'rgba(255, 0, 110, 0.6)',
  purple: 'rgba(161, 0, 242, 0.6)',
  orange: 'rgba(255, 107, 53, 0.6)',
} as const;

/** Create admin glow hover effect */
export function createAdminGlow(color: keyof typeof adminNeonColors): TargetAndTransition {
  return {
    boxShadow: `0 0 30px ${adminNeonColors[color]}`,
    transition: transitions.smooth,
  };
}

/* ============================================
   ADMIN PRESETS
   ============================================ */

/** Admin card preset */
export const adminCardPreset = {
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, margin: '-50px' },
  variants: adminCardReveal,
  whileHover: { y: -4, transition: { duration: 0.2 } },
};

/** Admin KPI preset */
export const adminKPIPreset = {
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, margin: '0px' },
  variants: adminKPIContainer,
};

/** Admin table preset */
export const adminTablePreset = {
  initial: 'hidden',
  animate: 'visible',
  variants: adminTableContainer,
};

/** Admin timeline preset */
export const adminTimelinePreset = {
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, margin: '-50px' },
  variants: adminTimelineContainer,
};

/** Admin form preset */
export const adminFormPreset = {
  initial: 'hidden',
  animate: 'visible',
  variants: adminFormContainer,
};
