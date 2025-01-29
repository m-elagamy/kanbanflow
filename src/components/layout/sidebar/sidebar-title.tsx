import { FolderKanban } from "lucide-react";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const SidebarTitle = () => {
  return (
    <SidebarHeader className="border-b">
      <SidebarMenu className="pointer-events-none">
        <SidebarMenuItem>
          <SidebarMenuButton>
            <FolderKanban />
            KanbanFlow
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
};

export default SidebarTitle;
