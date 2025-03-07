"use client";

import { motion } from "framer-motion";
import { glowVariant, particleVariants } from "@/utils/motion-variants";

const FloatingParticles = () => {
  return (
    <>
      <motion.div
        className="absolute -top-2 left-0 size-7 rounded-full bg-gradient-to-t from-[#51FFC0]/30 via-[#5AD8BC]/30 to-[#74A9BD] shadow-lg dark:from-[#004483]/10 dark:via-[#056F6E]/10 dark:to-[#045943]/10"
        variants={particleVariants}
        animate="float1"
        aria-hidden="true"
      >
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-t from-[#51FFC0]/25 via-[#5AD8BC]/25 to-[#74A9BD]/25 blur-md"
          variants={glowVariant}
          animate="animate"
        />
      </motion.div>

      <motion.div
        className="absolute -bottom-2 right-0 size-7 rounded-full bg-gradient-to-t from-[#EEBF2E]/30 via-[#EEA336]/30 to-[#EF7266] shadow-lg dark:from-[#6A0000]/10 dark:via-[#AA2A07]/10 dark:to-[#9A6B12]/10"
        variants={particleVariants}
        animate="float2"
        aria-hidden="true"
      >
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-t from-[#EEBF2E]/25 via-[#EEA336]/25 to-[#EF7266]/25 blur-md"
          variants={glowVariant}
          animate="animate"
          transition={{ delay: 0.5 }}
        />
      </motion.div>
    </>
  );
};

export default FloatingParticles;
