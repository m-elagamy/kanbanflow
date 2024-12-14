import { CirclePlus } from "lucide-react";
import BoardModal from "@/app/dashboard/components/board/board-modal";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const SidebarActions = () => {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <BoardModal
              mode="create"
              trigger={
                <SidebarMenuButton className={`group/icon`} tooltip="New Board">
                  <CirclePlus className="text-muted-foreground transition-colors group-hover/icon:text-primary" />
                  <span>New Board</span>
                </SidebarMenuButton>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default SidebarActions;
