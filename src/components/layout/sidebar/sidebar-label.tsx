"use client";

import { Badge } from "@/components/ui/badge";
import { SidebarGroupLabel } from "@/components/ui/sidebar";
import useKanbanStore from "@/stores/kanban";

const SidebarLabel = () => {
  const boardsLength = useKanbanStore((state) => state.boards.length);

  return (
    <SidebarGroupLabel className="justify-between">
      Boards
      {boardsLength > 0 && (
        <Badge variant="outline" className="h-5 px-[7px] text-[0.690rem]">
          {boardsLength}
        </Badge>
      )}
    </SidebarGroupLabel>
  );
};

export default SidebarLabel;
