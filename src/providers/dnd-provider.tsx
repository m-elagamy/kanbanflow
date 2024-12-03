"use client";

const DndContext = dynamic(
  () => import("@dnd-kit/core").then((mod) => mod.DndContext),
  {
    ssr: false,
    loading: () => null,
  },
);
const DragOverlay = dynamic(
  () => import("@dnd-kit/core").then((mod) => mod.DragOverlay),
  { ssr: false },
);
import { memo, ReactNode, useCallback } from "react";
import dynamic from "next/dynamic";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
  TouchSensor,
  closestCorners,
} from "@dnd-kit/core";

import useKanbanStore from "@/stores/use-kanban-store";
import TaskCard from "@/app/boards/components/task/task-card";

const DndProvider = memo(({ children }: { children: ReactNode }) => {
  const moveTask = useKanbanStore((state) => state.moveTask);
  const getTaskById = useKanbanStore((state) => state.getTaskById);
  const activeTask = useKanbanStore((state) => state.activeTask);
  const setActiveTask = useKanbanStore((state) => state.setActiveTask);

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

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { id } = event.active;
      const [columnId, taskId] = (id as string).split("_");
      const task = getTaskById(columnId, taskId);
      setActiveTask(task);
    },
    [getTaskById, setActiveTask],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over) return;

      const [fromColumn, taskId] = (active.id as string).split("_");
      const [toColumn] = (over.id as string).split("_");

      if (fromColumn && toColumn) {
        const destinationTasks = useKanbanStore
          .getState()
          .getColumnTasks(toColumn);

        const overIndex = destinationTasks.findIndex(
          (task) => `${toColumn}_${task.id}` === over.id,
        );

        const dropIndex =
          overIndex === -1 ? destinationTasks.length : overIndex;
        moveTask(taskId, fromColumn, toColumn, dropIndex);
      }
      setActiveTask(null);
    },
    [moveTask, setActiveTask],
  );

  const handleDragOver = (event: DragOverEvent) => {
    console.log("Dragged over:", event.over?.id);
  };

  const handleDragCancel = () => setActiveTask(null);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {children}
      {activeTask && (
        <DragOverlay>
          <TaskCard task={activeTask} />
        </DragOverlay>
      )}
    </DndContext>
  );
});

DndProvider.displayName = "DndProvider";

export default DndProvider;
