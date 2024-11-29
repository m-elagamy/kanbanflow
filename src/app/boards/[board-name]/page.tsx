"use client";

import { Card, CardContent } from "@/components/ui/card";
import BoardHeader from "../components/board/board-header";
import TaskCard from "../components/task/task-card";
import ColumnHeader from "../components/column/column-header";
import useBoardStore from "@/store/useBoardStore";
import NoTasksMessage from "../components/task/no-tasks-message";
import ColumnModal from "../components/column/column-modal";

export default function Board() {
  const { getCurrentBoard } = useBoardStore();
  const currentBoard = getCurrentBoard();

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

  console.log(currentBoard);

  return (
    <div className="container relative right-3 flex h-full flex-col overflow-hidden p-0 pb-8 md:right-4">
      <BoardHeader />

      <div className="scrollbar-hide flex h-full snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth md:justify-start">
        {currentBoard?.columns?.map((column) => (
          <Card
            key={column.id}
            className="max-h-[550px] w-64 min-w-64 snap-start overflow-y-auto md:w-72 md:min-w-72"
          >
            <ColumnHeader column={column} />
            <CardContent className="flex-grow space-y-2 overflow-y-auto p-3">
              {column.tasks?.length === 0 ? (
                <NoTasksMessage columnId={column.id} />
              ) : (
                column.tasks?.map((task) => (
                  <TaskCard key={task.id} task={task} columnId={column.id} />
                ))
              )}
            </CardContent>
          </Card>
        ))}
        <ColumnModal />
      </div>
    </div>
  );
}
