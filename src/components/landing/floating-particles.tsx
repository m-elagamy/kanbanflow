import { motion, useReducedMotion } from "motion/react";
import { glowVariant, particleVariants } from "@/utils/motion-variants";

const FloatingParticles = () => {
  const shouldReduceMotion = useReducedMotion();

  const particleProps = (animateName: string, delay: number = 0) => ({
    variants: shouldReduceMotion ? undefined : particleVariants,
    animate: !shouldReduceMotion ? animateName : undefined,
    initial: { opacity: 0, scale: 0.5, y: -10 },
    transition: { duration: 0.5, ease: "easeOut" as const, delay },
    "aria-hidden": true,
  });

  const glowProps = {
    className: "absolute inset-0 rounded-full bg-linear-to-t blur-md",
    variants: shouldReduceMotion ? undefined : glowVariant,
    animate: !shouldReduceMotion ? "animate" : undefined,
  };

  return (
    <>
      <motion.div
        className="absolute left-0 size-7 rounded-full bg-linear-to-t from-[#51FFC0]/30 via-[#5AD8BC]/30 to-[#74A9BD] shadow-lg dark:from-[#004483]/10 dark:via-[#056F6E]/10 dark:to-[#045943]/10"
        {...particleProps("float1")}
      >
        <motion.div
          {...glowProps}
          className={`${glowProps.className} from-[#51FFC0]/25 via-[#5AD8BC]/25 to-[#74A9BD]/25`}
        />
      </motion.div>

      <motion.div
        className="absolute -right-2 -bottom-2 size-7 rounded-full bg-linear-to-t from-[#EEBF2E]/30 via-[#EEA336]/30 to-[#EF7266] shadow-lg dark:from-[#6A0000]/10 dark:via-[#AA2A07]/10 dark:to-[#9A6B12]/10"
        {...particleProps("float2", 0.2)}
      >
        <motion.div
          {...glowProps}
          className={`${glowProps.className} from-[#EEBF2E]/25 via-[#EEA336]/25 to-[#EF7266]/25`}
        />
      </motion.div>
    </>
  );
};

export default FloatingParticles;
