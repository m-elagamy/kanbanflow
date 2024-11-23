"use client";

import {
  PlusIcon,
  ListTodoIcon,
  TrashIcon,
  Ellipsis,
  Settings2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TaskCreationModal from "../components/modals/task-creation";
import useBoardStore from "@/store/useBoardStore";
import TaskCard from "../components/task-card";
import { useParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function Board() {
  const params = useParams();
  const { boards, addColumn, deleteColumn } = useBoardStore();
  const generateUniqueId = () => uuidv4();

  const currentBoard = boards.find(
    (board) =>
      board.title.toLowerCase().trim().replace(/\s+/g, "-") ===
      params.board?.toString().trim(),
  );

  const handleAddColumn = () => {
    if (currentBoard) {
      addColumn(currentBoard.id, {
        id: generateUniqueId(),
        title: "",
        tasks: [],
      });
    }
  };

  const handleDeleteColumn = (columnId: string) => {
    if (currentBoard) {
      deleteColumn(currentBoard.id, columnId);
    }
  };

  console.log(currentBoard);

  if (!currentBoard) {
    return <div>Board not found</div>; //TODO: Handle invalid board routes.
  }

  return (
    <div className="container relative right-3 flex h-full w-full flex-col overflow-hidden p-0 pb-4 pt-16 md:right-0">
      {/* Header */}
      <div className="flex items-center justify-between py-8">
        <div className="flex items-center gap-2">
          <ListTodoIcon size={20} />
          <h1 className="text-sm font-semibold capitalize md:text-base">
            {params.board?.toString().replace(/-/g, " ")}
          </h1>
          <p className="text-xs text-muted-foreground md:text-sm">
            {currentBoard.description}
          </p>
        </div>

        <Button
          variant="outline"
          className="h-7 gap-0 p-1 md:mr-8 md:h-8 md:p-3"
          onClick={handleAddColumn}
        >
          <PlusIcon className="!size-3" />
          <span className="text-xs">Add Column</span>
        </Button>
      </div>

      {/* Board Columns */}
      <div className="flex-grow overflow-x-auto">
        <div className="flex h-full gap-4">
          {currentBoard.columns.map((column) => (
            <Card
              key={column.id}
              className="max-h-[550px] w-72 min-w-72 overflow-auto"
            >
              <CardHeader className="sticky top-0 flex-row items-center justify-between border-b bg-card/80 p-3 drop-shadow-sm backdrop-blur-sm">
                <CardTitle className="flex gap-1 text-sm md:text-base">
                  {column.title}
                </CardTitle>
                <div className="flex items-center gap-1">
                  <TaskCreationModal columnId={column.id} />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Ellipsis />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Settings2 /> Edit Column
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteColumn(column.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <TrashIcon /> Delete Column
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-2 overflow-y-auto p-3">
                {column.tasks?.length === 0 ? (
                  <div className="py-4 text-center text-sm text-muted-foreground">
                    No tasks
                  </div>
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
