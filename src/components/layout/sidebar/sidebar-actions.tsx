"use client";

import { CirclePlus } from "lucide-react";
import BoardModal from "@/app/dashboard/components/board/board-modal";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const SidebarActions = () => {
  const { open } = useSidebar();
  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem>
          <BoardModal
            mode="create"
            trigger={
              <SidebarMenuButton
                className={`group/icon justify-center ${open ? "gap-2" : "gap-0"}`}
                tooltip="New Board"
                variant="outline"
              >
                <CirclePlus className="text-muted-foreground transition-colors group-hover/icon:text-primary" />
                <span>New Board</span>
              </SidebarMenuButton>
            }
          />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default SidebarActions;
