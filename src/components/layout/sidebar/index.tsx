import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarRail,
} from "@/components/ui/sidebar";
import { getAllUserBoardsAction } from "@/actions/user";
import SidebarTitle from "./sidebar-title";
import SidebarActions from "./sidebar-actions";
import { UserProfile } from "./user-profile";
import SidebarLabel from "./sidebar-label";
import { BoardsList } from "./boards-list";

export default async function DashboardSidebar() {
  const userBoards = (await getAllUserBoardsAction()).fields;

  return (
    <Sidebar collapsible="icon">
      <SidebarTitle />
      <SidebarContent>
        <SidebarGroup>
          <SidebarLabel boardsCount={userBoards?.length} />
          <SidebarGroupContent>
            {userBoards && <BoardsList boards={userBoards} />}
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarActions />
      </SidebarContent>
      <SidebarFooter>
        <UserProfile />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
