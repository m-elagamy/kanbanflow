"use client";

import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import {
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import TaskCard from "@/app/dashboard/components/task/task-card";

import { useDndHandlers } from "@/hooks/use-dnd-handlers";

const DndContext = dynamic(
  () => import("@dnd-kit/core").then((mod) => mod.DndContext),
  {
    ssr: false,
    loading: () => null,
  },
);

const DndProvider = ({ children }: { children: ReactNode }) => {
  const { activeTask, handleDragStart, handleDragEnd, handleDragCancel } =
    useDndHandlers();
  const [isMounted, setIsMounted] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {children}
      {isMounted &&
        createPortal(
          <DragOverlay>
            {activeTask ? (
              <div className="w-64">
                <TaskCard task={activeTask} isDragging />
              </div>
            ) : null}
          </DragOverlay>,
          document.body,
        )}
    </DndContext>
  );
};

export default DndProvider;
