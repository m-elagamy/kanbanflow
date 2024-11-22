"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Kanban } from "lucide-react";
import { usePathname } from "next/navigation";

const KanbanLogo = () => {
  const pathName = usePathname();
  return (
    <motion.div
      className={`${pathName === "/" ? "mx-0" : "mx-auto"} md:mx-0`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 250, damping: 3 }}
    >
      <Link
        href="/"
        className="group flex items-center gap-2"
        aria-label="Go to KanbanFlow homepage"
      >
        <motion.div
          className={`grid size-5 rotate-45 transform place-content-center rounded-lg bg-gradient-to-r from-[#3b4a56] to-[#4A90E2] md:size-6`}
          animate={{
            rotate: 45,
            transition: { type: "spring", stiffness: 250, damping: 3 },
          }}
        >
          <Kanban className="size-4 -rotate-45 text-white md:size-5" />
        </motion.div>

        <span
          className={`bg-gradient-to-r from-[#5A6A78] to-[#5FAFFF] bg-clip-text text-lg font-bold tracking-wide text-transparent md:text-xl`}
        >
          KanbanFlow
        </span>
      </Link>
    </motion.div>
  );
};

export default KanbanLogo;
