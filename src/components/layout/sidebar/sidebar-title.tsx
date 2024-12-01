import { FolderKanban } from "lucide-react";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export default function SidebarTitle() {
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
}
