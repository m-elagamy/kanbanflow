"use client";

import { Card, CardContent } from "@/components/ui/card";
import BoardHeader from "../components/board-header";
import TaskCard from "../components/task-card";
import ColumnHeader from "../components/column-header";
import useBoardStore from "@/store/useBoardStore";
import NoTasksMessage from "../components/no-tasks-message";
import ColumnCreationModal from "../components/modals/column-creation";

export default function Board() {
  const { getCurrentBoard } = useBoardStore();
  const currentBoard = getCurrentBoard();

  if (!currentBoard) {
    return (
      <div className="flex h-screen flex-grow items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Board not found</h2>
          <p className="mt-2 text-gray-600">
            This board may have been deleted or doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative right-3 flex h-full w-full flex-col overflow-hidden p-0 pb-4 pt-16 md:right-0">
      <BoardHeader />

      <div className="flex-grow overflow-x-auto">
        <div className="flex h-full justify-center gap-4 md:justify-start">
          {currentBoard?.columns?.map((column) => (
            <Card
              key={column.id}
              className="max-h-[550px] w-72 min-w-72 overflow-auto"
            >
              <ColumnHeader column={column} />
              <CardContent className="flex-grow space-y-2 overflow-y-auto p-3">
                {column.tasks?.length === 0 ? (
                  <NoTasksMessage columnId={column.id} />
                ) : (
                  column.tasks?.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))
                )}
              </CardContent>
            </Card>
          ))}
          <ColumnCreationModal />
        </div>
      </div>
    </div>
  );
}
