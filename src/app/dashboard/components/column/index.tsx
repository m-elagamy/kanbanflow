"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
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
  const columnsContainerRef = useRef<HTMLDivElement>(null);
  const [hasMoreColumns, setHasMoreColumns] = useState(false);
  const columns = useColumnStore(
    useShallow((state) => state.columnsByBoard[boardId] || {}),
  );

  const availableColumns = Object.values(columns);
  const sortedColumns = (
    availableColumns.length ? availableColumns : initialColumns
  ).sort((a, b) => a.order - b.order);
  const columnIds = sortedColumns.map((column) => column.id);

  useEffect(() => {
    const container = columnsContainerRef.current;
    if (!container) return;

    const updateOverflowHint = () => {
      const remainingScroll =
        container.scrollWidth - container.clientWidth - container.scrollLeft;
      setHasMoreColumns(remainingScroll > 8);
    };

    updateOverflowHint();
    container.addEventListener("scroll", updateOverflowHint, { passive: true });
    const resizeObserver = new ResizeObserver(updateOverflowHint);
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener("scroll", updateOverflowHint);
      resizeObserver.disconnect();
    };
  }, [sortedColumns.length]);

  return (
    <div
      ref={columnsContainerRef}
      className="scrollbar-thumb-border focus-visible:ring-ring flex min-h-0 min-w-0 flex-1 snap-x snap-proximity scroll-px-3 gap-3 overflow-x-auto px-3 pb-4 outline-none focus-visible:ring-2 focus-visible:ring-inset sm:scroll-px-4 sm:gap-4 sm:px-4 md:snap-none md:justify-start"
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
              className="h-full flex-none will-change-transform"
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
      {hasMoreColumns && (
        <button
          type="button"
          aria-label="Scroll to more columns"
          className="from-background text-muted-foreground hover:text-foreground sticky right-0 z-10 -mr-3 flex w-10 shrink-0 cursor-pointer items-center justify-center bg-gradient-to-r to-transparent transition-colors sm:-mr-4"
          onClick={() =>
            columnsContainerRef.current?.scrollBy({
              left: columnsContainerRef.current.clientWidth * 0.8,
              behavior: "smooth",
            })
          }
        >
          <span className="text-muted-foreground text-lg leading-none">›</span>
        </button>
      )}
    </div>
  );
};

export default ColumnsWrapper;
