import { Variants, Transition, TargetAndTransition } from 'framer-motion';

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
