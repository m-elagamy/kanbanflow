import { Suspense } from "react";
import { unauthorized } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import SidebarTitle from "./sidebar-title";
import SidebarActions from "./sidebar-actions";
import SidebarLabel from "./sidebar-label";
import BoardsList from "./boards-list";
import { NavUser } from "@/components/layout/sidebar/nav-user";
import { getAllUserBoardsAction } from "@/actions/user";

export async function WorkspaceSidebar() {
  const { userId } = await auth();

  if (!userId) {
    unauthorized();
  }

  const userBoards = (await getAllUserBoardsAction(userId)).data;

  return (
    <Sidebar collapsible="icon">
      <SidebarTitle />
      <SidebarContent>
        <SidebarGroup>
          <SidebarLabel boardsCount={userBoards?.length} />
          <SidebarGroupContent>
            <Suspense fallback={<SidebarMenuSkeleton showIcon />}>
              {userBoards && <BoardsList boards={userBoards} />}
            </Suspense>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarActions />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
