"use client";

import {
  PlusIcon,
  ListTodoIcon,
  MoreVerticalIcon,
  TrashIcon,
  FolderPen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import AddItemModal from "../components/modals/add-item-modal";
import useBoardStore from "@/store/useBoardStore";

const priorityColors = {
  high: "bg-gradient-to-r from-red-500 to-orange-600 dark:from-red-700 dark:to-orange-800 text-white",
  medium:
    "bg-gradient-to-r from-amber-400 to-yellow-500 dark:from-amber-600 dark:to-yellow-700 text-black dark:text-white",
  low: "bg-gradient-to-r from-green-600 to-teal-500 dark:from-green-600 dark:to-teal-700 text-white",
};

export default function AdvancedBoard() {
  const { columns, addColumn, deleteColumn } = useBoardStore();

  return (
    <div className="container flex h-full flex-col pt-16">
      {/* Header */}
      <div className="flex items-center justify-between border-b py-4">
        <div className="flex items-center gap-2">
          <ListTodoIcon />
          <h1 className="text-xl font-semibold">Project Board</h1>
        </div>

        <Button
          variant="outline"
          className="gap-1 px-2"
          onClick={() =>
            addColumn({ id: `column-${Date.now()}`, title: "New Column" })
          }
        >
          <PlusIcon /> Add Column
        </Button>
      </div>

      {/* Board Columns */}
      <div className="flex-grow overflow-x-auto py-4">
        <div className="flex h-full gap-4">
          {columns.map((column) => (
            <Card key={column.id} className="h-full w-72">
              <CardHeader className="flex-row items-center justify-between p-3 pb-0 pt-2">
                <CardTitle>{column.title}</CardTitle>
                <div className="flex items-center gap-1">
                  <AddItemModal columnId={column.id} />
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
                  column.tasks?.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent/25"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{item.title}</h3>
                          <Badge
                            className={`${priorityColors[item.priority as keyof typeof priorityColors]} pointer-events-none rounded-full px-2 text-[0.625rem] uppercase tracking-wider`}
                          >
                            {item.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {item.description}
                        </p>
                        {item.tags.length > 0 &&
                          item.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="mr-1 text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                      </div>
                    </div>
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
