// Centralized motion patterns — every animated component pulls from here so
// timing/easing stays consistent instead of bespoke transitions per file.
import type { Variants, Transition } from "framer-motion";

export const EASE_PREMIUM = [0.22, 1, 0.36, 1] as const;

export const transitionBase: Transition = { duration: 0.6, ease: EASE_PREMIUM };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: transitionBase },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: transitionBase },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: transitionBase },
};

export const slideIn: Variants = {
  hidden: { opacity: 0, x: 24 },
  show: { opacity: 1, x: 0, transition: transitionBase },
};

export const staggerContainer = (stagger = 0.1, delayChildren = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

/** Standard "reveal on scroll" props for whileInView usage. */
export const revealOnScroll = {
  initial: "hidden",
  whileInView: "show",
  viewport: { once: true, margin: "-60px" },
} as const;

export const floatY: Variants = {
  float: {
    y: [0, -12, 0],
    transition: { duration: 6, repeat: Infinity, ease: EASE_PREMIUM },
  },
};
