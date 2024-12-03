import { FolderKanban } from "lucide-react";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const SidebarTitle = () => {
  return (
    <SidebarHeader>
      <SidebarMenu className="pointer-events-none">
        <SidebarMenuItem>
          <SidebarMenuButton>
            <FolderKanban />
            Workspace
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
};

export default SidebarTitle;
