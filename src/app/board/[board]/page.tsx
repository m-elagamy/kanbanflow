"use client";

import { useParams } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import BoardHeader from "../components/board-header";
import TaskCard from "../components/task-card";
import ColumnHeader from "../components/column-header";
import useBoardStore from "@/store/useBoardStore";
import NoTasksMessage from "../components/no-tasks-message";
import generateUniqueID from "@/utils/generate-unique-ID";

export default function Board() {
  const params = useParams();
  const { boards, addColumn, deleteColumn } = useBoardStore();
  const uniqueID = () => generateUniqueID();

  const currentBoard = boards.find(
    (board) =>
      board.title.toLowerCase().trim().replace(/\s+/g, "-") ===
      params.board?.toString().trim(),
  );

  if (!currentBoard) {
    return (
      <div className="flex h-full flex-grow items-center justify-center">
        <p className="text-lg text-muted-foreground">Board not found</p>
      </div>
    );
  }

  const handleAddColumn = () => {
    addColumn(currentBoard.id, {
      id: uniqueID(),
      title: "",
      tasks: [],
    });
  };

  const handleDeleteColumn = (columnId: string) => {
    deleteColumn(currentBoard.id, columnId);
  };

  return (
    <div className="container relative right-3 flex h-full w-full flex-col overflow-hidden p-0 pb-4 pt-16 md:right-0">
      <BoardHeader
        title={currentBoard.title}
        description={currentBoard.description}
        onAddColumn={handleAddColumn}
      />

      <div className="flex-grow overflow-x-auto">
        <div className="flex h-full gap-4">
          {currentBoard.columns.map((column) => (
            <Card
              key={column.id}
              className="max-h-[550px] w-72 min-w-72 overflow-auto"
            >
              <ColumnHeader
                columnId={column.id}
                columnTitle={column.title}
                tasksCount={column.tasks?.length ?? 0}
                handleDeleteColumn={handleDeleteColumn}
              />
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
        </div>
      </div>
    </div>
  );
}
