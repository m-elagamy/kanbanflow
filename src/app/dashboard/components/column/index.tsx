"use client";

import { motion, useReducedMotion } from "motion/react";
import { useShallow } from "zustand/react/shallow";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DndProvider } from "@/providers/dnd-provider";
import { useColumnStore } from "@/stores/column";
import ColumnCard from "./column-card";
import ColumnModal from "./column-modal";
import type { ClientTask } from "@/lib/types";
import type { SimplifiedColumn } from "@/lib/types/stores/column";
import type { PriorityFilterValue } from "@/lib/types/stores/task";
type ColumnsWrapperProps = {
  boardId: string;
  focusedTaskId?: string;
  animateEntry?: boolean;
  initialColumns?: (SimplifiedColumn & { tasks: ClientTask[] })[];
  priorityFilter: PriorityFilterValue;
};

const ColumnsWrapper = ({
  boardId,
  focusedTaskId,
  animateEntry = false,
  initialColumns = [],
  priorityFilter,
}: ColumnsWrapperProps) => {
  const shouldReduceMotion = useReducedMotion();
  const columns = useColumnStore(
    useShallow((state) => state.columnsByBoard[boardId] || {}),
  );

  const availableColumns = Object.values(columns);
  const sortedColumns = (
    availableColumns.length ? availableColumns : initialColumns
  ).sort((a, b) => a.order - b.order);
  const columnIds = sortedColumns.map((column) => column.id);

  return (
    <div
      className="scrollbar-thumb-border focus-visible:ring-ring flex h-full snap-x snap-proximity gap-3 overflow-x-auto scroll-smooth px-3 pb-4 outline-none focus-visible:ring-2 focus-visible:ring-inset sm:gap-4 sm:px-4 md:justify-start"
      role="region"
      aria-label="Board columns"
      tabIndex={0}
    >
      <DndProvider boardId={boardId}>
        <SortableContext
          items={columnIds}
          strategy={horizontalListSortingStrategy}
        >
          {sortedColumns.map((column, index) => (
            <motion.div
              key={column.id}
              className="flex-none will-change-transform"
              initial={
                animateEntry && !shouldReduceMotion
                  ? { opacity: 0, y: 24 }
                  : false
              }
              animate={{ opacity: 1, y: 0 }}
              transition={
                animateEntry && !shouldReduceMotion
                  ? { duration: 0.48, delay: index * 0.08, ease: "easeOut" }
                  : { duration: 0 }
              }
            >
              <ColumnCard
                column={column}
                focusedTaskId={focusedTaskId}
                initialTasks={
                  initialColumns.find((item) => item.id === column.id)?.tasks
                }
                hasInitialData={initialColumns.some(
                  (item) => item.id === column.id,
                )}
                priorityFilter={priorityFilter}
              />
            </motion.div>
          ))}
        </SortableContext>
      </DndProvider>

      <ColumnModal boardId={boardId} />
    </div>
  );
};

export default ColumnsWrapper;
