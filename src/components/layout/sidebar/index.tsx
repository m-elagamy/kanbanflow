import { unauthorized } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { getAllUserBoardsAction } from "@/actions/user";
import SidebarTitle from "./sidebar-title";
import SidebarActions from "./sidebar-actions";
import { UserProfile } from "./user-profile";
import SidebarLabel from "./sidebar-label";
import { BoardsList } from "./boards-list";

export default async function DashboardSidebar() {
  const { userId } = await auth();

  if (!userId) {
    unauthorized();
  }

  const userBoards = (await getAllUserBoardsAction(userId)).fields;

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
    </Sidebar>
  );
}
