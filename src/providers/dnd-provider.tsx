"use client";

import { ReactNode } from "react";
import dynamic from "next/dynamic";
import { useShallow } from "zustand/shallow";
const DndContext = dynamic(
  () => import("@dnd-kit/core").then((mod) => mod.DndContext),
  {
    ssr: false,
    loading: () => null,
  },
);
import {
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  TouchSensor,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";

import TaskCard from "@/app/dashboard/components/task/task-card";
import useKanbanStore from "@/stores/kanban";

const DndProvider = ({ children }: { children: ReactNode }) => {
  const { moveTask, getTaskById, activeTask, setActiveTask } = useKanbanStore(
    useShallow((state) => ({
      moveTask: state.moveTask,
      getTaskById: state.getTaskById,
      activeTask: state.activeTask,
      setActiveTask: state.setActiveTask,
    })),
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { id } = event.active;
    const [columnId, taskId] = (id as string).split("_");
    const task = getTaskById(columnId, taskId);
    setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
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

      const dropIndex = overIndex === -1 ? destinationTasks.length : overIndex;
      moveTask(taskId, fromColumn, toColumn, dropIndex);
    }
    setActiveTask(null);
  };

  const handleDragCancel = () => setActiveTask(null);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {children}
      <DragOverlay>
        {activeTask && <TaskCard task={activeTask} isDragging />}
      </DragOverlay>
    </DndContext>
  );
};

export default DndProvider;
