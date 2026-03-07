"use client";

import { FolderKanban, PlusCircle } from "lucide-react";
import { motion } from "motion/react";
import BoardModal from "./board-modal";

export default function DashboardEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut", delay: 0.1 }}
      className="flex flex-col items-center gap-5 py-16 text-center"
    >
      <span className="bg-primary/10 text-primary flex h-14 w-14 items-center justify-center rounded-2xl">
        <FolderKanban className="h-7 w-7" />
      </span>
      <div className="space-y-2">
        <p className="text-xl font-semibold">No boards yet</p>
        <p className="text-muted-foreground text-sm md:text-base">
          Create your first board to start organizing tasks and projects.
        </p>
      </div>
      <BoardModal
        mode="create"
        modalId="dashboard-empty-new-board"
        trigger={
          <button>
            <PlusCircle className="h-4 w-4" />
            Create a board
          </button>
        }
      />
    </motion.div>
  );
}
