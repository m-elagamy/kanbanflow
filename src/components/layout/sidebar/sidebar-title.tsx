import { FolderKanban } from "lucide-react";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { memo } from "react";

const SidebarTitle = memo(() => {
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
});

SidebarTitle.displayName = "SidebarTitle";

export default SidebarTitle;
