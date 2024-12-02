import { memo, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { SidebarGroupLabel } from "@/components/ui/sidebar";
import useKanbanStore from "@/stores/use-kanban-store";

const SidebarLabel = memo(() => {
  const boardsLength = useKanbanStore(
    useCallback((state) => state.boards.length, []),
  );

  return (
    <SidebarGroupLabel className="justify-between">
      Boards
      {boardsLength > 0 && (
        <Badge variant="outline" className="h-5 px-2 text-[0.625rem]">
          {boardsLength}
        </Badge>
      )}
    </SidebarGroupLabel>
  );
});

SidebarLabel.displayName = "SidebarLabel";

export default SidebarLabel;
