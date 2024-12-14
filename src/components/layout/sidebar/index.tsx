import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import SidebarTitle from "./sidebar-title";
import SidebarActions from "./sidebar-actions";
import SidebarLabel from "./sidebar-label";
import BoardsList from "./boards-list";
import { NavUser } from "@/app/dashboard/components/nav-user";

export function WorkspaceSidebar() {
  const user = {
    name: "Mahmoud Elagamy",
    avatar: "https://github.com/Mahmoud-Elagamy.png",
    email: "mahmoudelagamy474@gmail.com",
  };
  return (
    <Sidebar collapsible="icon">
      <SidebarTitle />
      <SidebarContent>
        <SidebarGroup>
          <SidebarLabel />
          <SidebarGroupContent>
            <BoardsList />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarActions />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
