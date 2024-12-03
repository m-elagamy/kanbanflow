import { CirclePlus } from "lucide-react";
import BoardModal from "@/app/boards/components/board/board-modal";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const SidebarActions = () => {
  const { state, isMobile } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <BoardModal
              mode="create"
              trigger={
                <SidebarMenuButton
                  className={`group/icon ${state === "expanded" || isMobile ? "justify-center" : "justify-start"}`}
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
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default SidebarActions;
