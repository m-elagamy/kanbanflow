"use client";

import { FolderKanban } from "lucide-react";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { deleteAllBoardsAction } from "@/actions/board";

const SidebarTitle = ({ userId }: { userId: string }) => {
  return (
    <SidebarHeader className="border-b">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={() => deleteAllBoardsAction(userId)}
            tooltip="Delete all boards"
          >
            <FolderKanban />
            KanbanFlow
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
};

export default SidebarTitle;
