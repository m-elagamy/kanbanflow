import { Variants } from "framer-motion";

const fadeIn: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeInOut" },
  },
};

const stagger: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const particleVariants = {
  float1: {
    y: [0, -15, 0],
    x: [0, 7, 0],
    scale: [1, 1.15, 0.9, 1],
    rotate: [0, 5, -5, 0],
    transition: {
      y: {
        repeat: Number.POSITIVE_INFINITY,
        duration: 6,
        ease: "easeInOut",
      },
      x: {
        repeat: Number.POSITIVE_INFINITY,
        duration: 7,
        ease: "easeInOut",
      },
      scale: {
        repeat: Number.POSITIVE_INFINITY,
        duration: 8,
        ease: "easeInOut",
      },
      rotate: {
        repeat: Number.POSITIVE_INFINITY,
        duration: 9,
        ease: "easeInOut",
      },
    },
  },
  float2: {
    y: [0, 15, 0],
    x: [0, -7, 0],
    scale: [1, 0.9, 1.1, 1],
    rotate: [0, -7, 3, 0],
    transition: {
      y: {
        repeat: Number.POSITIVE_INFINITY,
        duration: 7,
        ease: "easeInOut",
      },
      x: {
        repeat: Number.POSITIVE_INFINITY,
        duration: 8,
        ease: "easeInOut",
      },
      scale: {
        repeat: Number.POSITIVE_INFINITY,
        duration: 6,
        ease: "easeInOut",
      },
      rotate: {
        repeat: Number.POSITIVE_INFINITY,
        duration: 8,
        ease: "easeInOut",
      },
    },
  },
};

const glowVariant = {
  animate: {
    opacity: [0.5, 0.8, 0.5],
    scale: [1, 1.1, 1],
    transition: {
      repeat: Number.POSITIVE_INFINITY,
      duration: 4,
      ease: "easeInOut",
    },
  },
};

export { fadeIn, stagger, particleVariants, glowVariant };
