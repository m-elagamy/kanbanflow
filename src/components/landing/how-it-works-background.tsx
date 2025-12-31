"use client";

import { motion, useReducedMotion, Variants } from "motion/react";

const HowItWorksBackground = () => {
  const shouldReduceMotion = useReducedMotion();

  const gridVariants: Variants = {
    animate: {
      opacity: [0.3, 0.6, 0.3],
      transition: {
        repeat: Infinity,
        duration: 8,
        ease: "easeInOut" as const,
      },
    },
  };

  const nodeVariants: Variants = {
    animate: (i: number) => ({
      y: [0, -10, 0],
      opacity: [0.4, 0.8, 0.4],
      scale: [1, 1.1, 1],
      transition: {
        repeat: Infinity,
        duration: 4 + i * 0.5,
        ease: "easeInOut" as const,
        delay: i * 0.2,
      },
    }),
  };

  const connectionVariants: Variants = {
    animate: {
      opacity: [0.2, 0.5, 0.2],
      transition: {
        repeat: Infinity,
        duration: 6,
        ease: "easeInOut" as const,
      },
    },
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradient overlay */}
      <div className="from-background/80 via-background/60 to-background/80 absolute inset-0 bg-gradient-to-br" />

      {/* Animated grid */}
      <motion.div
        className="absolute inset-0 opacity-30"
        variants={shouldReduceMotion ? undefined : gridVariants}
        animate={!shouldReduceMotion ? "animate" : undefined}
      >
        <svg
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="grid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.1"
                className="text-muted-foreground/20"
              />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </motion.div>

      {/* Floating nodes */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="from-primary/40 to-primary/20 absolute size-2 rounded-full bg-gradient-to-r"
          style={{
            left: `${10 + ((i * 12) % 80)}%`,
            top: `${15 + ((i * 18) % 70)}%`,
          }}
          custom={i}
          variants={shouldReduceMotion ? undefined : nodeVariants}
          animate={!shouldReduceMotion ? "animate" : undefined}
          initial={{ opacity: 0, scale: 0 }}
        >
          <div className="bg-primary/20 absolute inset-0 rounded-full blur-sm" />
        </motion.div>
      ))}

      {/* Connection lines */}
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M 20 25 Q 40 15 60 25 T 80 25"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.05"
          className="text-primary/20"
          variants={shouldReduceMotion ? undefined : connectionVariants}
          animate={!shouldReduceMotion ? "animate" : undefined}
        />
        <motion.path
          d="M 15 45 Q 35 35 55 45 T 85 45"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.05"
          className="text-primary/20"
          variants={shouldReduceMotion ? undefined : connectionVariants}
          animate={!shouldReduceMotion ? "animate" : undefined}
          transition={{ delay: 1 }}
        />
        <motion.path
          d="M 25 65 Q 45 55 65 65 T 75 65"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.05"
          className="text-primary/20"
          variants={shouldReduceMotion ? undefined : connectionVariants}
          animate={!shouldReduceMotion ? "animate" : undefined}
          transition={{ delay: 2 }}
        />
      </svg>

      {/* Subtle radial gradient */}
      <div className="bg-radial-gradient from-primary/5 absolute inset-0 via-transparent to-transparent" />
    </div>
  );
};

export default HowItWorksBackground;
