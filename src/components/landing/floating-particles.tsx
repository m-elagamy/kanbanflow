"use client";

import { motion } from "framer-motion";

const FloatingParticles = () => {
  return (
    <>
      <motion.div
        className="absolute -left-2 -top-4 h-8 w-8 rounded-full bg-blue-500/10"
        animate={{
          scale: [1, 1.2, 1],
          transition: {
            repeat: Infinity,
            duration: 2,
          },
        }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute -bottom-4 -right-2 h-8 w-8 rounded-full bg-purple-500/10"
        animate={{
          scale: [1, 1.2, 1],
          transition: {
            repeat: Infinity,
            duration: 2,
            delay: 0.5,
          },
        }}
        aria-hidden="true"
      />
    </>
  );
};

export default FloatingParticles;
