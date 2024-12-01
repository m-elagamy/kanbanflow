"use client";

import useKanbanStore from "@/stores/use-kanban-store";
import { useCallback } from "react";
import BoardWrapper from "../components/board";

export default function Board() {
  const currentBoard = useKanbanStore(
    useCallback((state) => state.getCurrentBoard(), []),
  );

  // TODO: Add 404 page
  if (!currentBoard) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-grow items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Board not found</h2>
          <p className="mt-2 text-gray-600">
            This board may have been deleted or doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  return <BoardWrapper />;
}
