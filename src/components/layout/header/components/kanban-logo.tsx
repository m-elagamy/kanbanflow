"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Kanban } from "lucide-react";

const KanbanLogo = () => {
  const pathName = usePathname();

  return (
    <motion.div
      className={`${pathName === "/" ? "mx-0" : "mx-auto"} relative z-[1] md:mx-0`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 250, damping: 3 }}
    >
      <div className="absolute inset-0 z-[-1] flex items-center justify-center">
        <div className="size-60 rounded-full bg-gradient-to-tr from-primary/10 via-primary/5 to-secondary/10 blur-3xl dark:from-primary/20 dark:via-primary/10 dark:to-secondary/20" />
      </div>
      <Link
        href="/"
        className="group flex items-center gap-1"
        aria-label="Go to KanbanFlow homepage"
      >
        <motion.div
          animate={{
            rotate: 45,
            transition: { type: "spring", stiffness: 250, damping: 3 },
          }}
        >
          <Kanban className="size-6 -rotate-45 text-primary/90 md:size-8" />
        </motion.div>

        <span
          className={`bg-primary bg-clip-text text-xl font-bold tracking-tight text-transparent md:text-2xl`}
        >
          KanbanFlow
        </span>
      </Link>
    </motion.div>
  );
};

export default KanbanLogo;
