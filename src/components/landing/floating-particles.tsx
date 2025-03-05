"use client";

import { motion } from "framer-motion";

const particleVariant = {
  animate: {
    scale: [1, 1.2, 1],
    transition: {
      repeat: Infinity,
      duration: 2,
    },
  },
};

const FloatingParticles = () => {
  return (
    <>
      <motion.div
        className="absolute -top-2 size-7 rounded-full bg-gradient-to-t from-[#51FFC0]/30 via-[#5AD8BC]/30 to-[#74A9BD] dark:from-[#004483]/10 dark:via-[#056F6E]/10 dark:to-[#045943]/10"
        variants={particleVariant}
        animate="animate"
        aria-hidden="true"
      />
      <motion.div
        className="absolute -bottom-2 right-0 size-7 rounded-full bg-gradient-to-t from-[#EEBF2E]/30 via-[#EEA336]/30 to-[#EF7266] dark:from-[#6A0000]/10 dark:via-[#AA2A07]/10 dark:to-[#9A6B12]/10"
        variants={particleVariant}
        animate="animate"
        transition={{ delay: 0.5 }}
        aria-hidden="true"
      />
    </>
  );
};

export default FloatingParticles;
