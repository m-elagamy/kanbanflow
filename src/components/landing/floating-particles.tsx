"use client";

import { motion } from "framer-motion";

const FloatingParticles = () => {
  return (
    <>
      <div className="absolute -top-40 left-1/2 size-80 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl dark:from-blue-500/20 dark:via-purple-500/20 dark:to-pink-500/20" />
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 rounded-full bg-blue-500/20"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3,
            delay: i * 0.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
};

export default FloatingParticles;
