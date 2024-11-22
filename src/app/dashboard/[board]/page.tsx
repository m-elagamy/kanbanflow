"use client";

import {
  PlusIcon,
  ListTodoIcon,
  MoreVerticalIcon,
  TrashIcon,
  FolderPen,
  CircleCheckBig,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AddTaskModal from "../components/modals/add-task";
import useBoardStore from "@/store/useBoardStore";
import TaskCard from "../components/task-card";

export default function AdvancedBoard() {
  const { columns, addColumn, deleteColumn } = useBoardStore();

  return (
    <div className="container relative right-3 flex h-full w-full flex-col overflow-hidden p-0 pb-4 pt-16 md:right-0">
      {/* Header */}
      <div className="flex items-center justify-between py-8">
        <div className="flex items-center gap-2">
          <ListTodoIcon size={20} />
          <h1 className="text-sm font-semibold md:text-base">Project Board</h1>
        </div>

        <Button
          variant="outline"
          className="h-7 gap-0 p-1 md:mr-8 md:h-8 md:p-3"
          onClick={() =>
            addColumn({ id: `column-${Date.now()}`, title: "New Column" })
          }
        >
          <PlusIcon className="!size-3" />
          <span className="text-xs">Add Column</span>
        </Button>
      </div>

      {/* Board Columns */}
      <div className="flex-grow overflow-x-auto">
        <div className="flex h-full gap-4">
          {columns.map((column) => (
            <Card
              key={column.id}
              className="h-full max-h-[650px] w-72 min-w-72 overflow-auto"
            >
              <CardHeader className="sticky top-0 flex-row items-center justify-between bg-card/80 p-3 pb-0 pt-2 shadow-sm drop-shadow-sm backdrop-blur-sm">
                <CardTitle className="flex gap-1 text-sm md:text-base">
                  {column.title} <CircleCheckBig size={16} />
                </CardTitle>
                <div className="flex items-center gap-1">
                  <AddTaskModal columnId={column.id} />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVerticalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <FolderPen /> Rename Column
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => deleteColumn(column.id)}
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
                    No items
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
