"use client";

import { Plus } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import EmptyBoardsIllustration from "@/components/ui/empty-boards-illustration";
import { EmptyState } from "@/components/ui/empty-state";
import BoardModal from "./board-modal";

export default function DashboardEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut", delay: 0.1 }}
      className="min-h-80"
    >
      <EmptyState
        illustration={<EmptyBoardsIllustration />}
        title="No boards yet"
        description="Create a board to start organizing your tasks and projects."
        action={
          <BoardModal
            mode="create"
            modalId="dashboard-empty-new-board"
            trigger={
              <Button>
                <Plus aria-hidden="true" />
                Create a board
              </Button>
            }
          />
        }
      />
    </motion.div>
  );
}
