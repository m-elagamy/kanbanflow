import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ClipboardPenLine } from "lucide-react";

const HeaderContent = () => {
  return (
    <SidebarMenu className="pointer-events-none">
      <SidebarMenuItem>
        <SidebarMenuButton>
          <ClipboardPenLine />
          Boards
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default HeaderContent;
