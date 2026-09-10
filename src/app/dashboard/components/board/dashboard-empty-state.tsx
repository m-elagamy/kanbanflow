"use client";

import { FolderKanban, Plus } from "lucide-react";
import { motion } from "motion/react";
import BoardModal from "./board-modal";

export default function DashboardEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut", delay: 0.1 }}
      className="border-border/60 bg-background/70 flex min-h-80 flex-col items-center justify-center gap-5 rounded-2xl border border-dashed px-6 py-12 text-center shadow-sm"
    >
      <span className="bg-primary/10 text-primary flex h-14 w-14 items-center justify-center rounded-2xl">
        <FolderKanban className="h-7 w-7" />
      </span>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">No boards yet</h2>
        <p className="text-muted-foreground mx-auto max-w-md text-sm md:text-base">
          Start with a template or a blank board, then add columns and tasks as
          your workflow takes shape.
        </p>
      </div>
      <BoardModal
        mode="create"
        modalId="dashboard-empty-new-board"
        trigger={
          <button>
            <Plus className="h-4 w-4" />
            New board
          </button>
        }
      />
    </motion.div>
  );
}
