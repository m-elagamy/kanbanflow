"use client";

import { useRef } from "react";
import type { Task } from "@prisma/client";

type TaskState = Record<string, Task[]>;

export default function useTaskStateComparison() {
  const initialStateRef = useRef<TaskState>(null);

  const captureInitialPosition = (currentState: TaskState) => {
    initialStateRef.current = JSON.parse(JSON.stringify(currentState));
  };

  const hasTaskPositionChanged = (
    currentState: TaskState,
    fromColumnId: string,
    toColumnId: string,
  ) => {
    const initialState = initialStateRef.current;

    if (fromColumnId !== toColumnId) return true;

    const initialColumn = initialState?.[fromColumnId] || [];
    const currentColumn = currentState[fromColumnId] || [];

    if (initialColumn.length !== currentColumn.length) return true;

    return initialColumn.some(
      (task, index) =>
        task.id !== currentColumn[index].id ||
        task.order !== currentColumn[index].order,
    );
  };

  return { captureInitialPosition, hasTaskPositionChanged };
}
