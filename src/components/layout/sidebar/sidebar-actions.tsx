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
                className={`group/icon justify-center dark:hover:bg-accent/15 ${open ? "gap-2" : "gap-0"}`}
                tooltip="New Board"
                asChild
              >
                <button>
                  <CirclePlus className="text-muted-foreground transition-colors group-hover/icon:text-primary" />
                  <span>New Board</span>
                </button>
              </SidebarMenuButton>
            }
            variant="outline"
            modalId="sidebar-new-board"
          />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default SidebarActions;
