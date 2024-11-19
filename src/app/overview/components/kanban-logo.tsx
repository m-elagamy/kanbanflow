"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Kanban } from "lucide-react";

const KanbanLogo = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.05 }}
    >
      <Link
        href="/"
        className="group flex items-center gap-4"
        aria-label="Go to KanbanFlow homepage"
      >
        <motion.div
          className="grid size-6 rotate-45 transform place-content-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 md:size-8"
          animate={{
            rotate: 45,
            transition: { type: "spring", stiffness: 250, damping: 3 },
          }}
        >
          <Kanban className="size-5 -rotate-45 md:size-6" />
        </motion.div>

        <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-xl font-bold -tracking-wide text-transparent md:text-2xl">
          KanbanFlow
        </span>
      </Link>
    </motion.div>
  );
};

export default KanbanLogo;
