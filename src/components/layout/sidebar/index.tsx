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
import { currentUser } from "@clerk/nextjs/server";
import { unauthorized } from "next/navigation";
import { Suspense } from "react";
import { getAllUserBoards } from "@/lib/dal/user";

export async function WorkspaceSidebar() {
  const authUser = await currentUser();

  if (!authUser) {
    unauthorized();
  }

  const userBoards = await getAllUserBoards(authUser?.id);

  return (
    <Sidebar collapsible="icon">
      <SidebarTitle />
      <SidebarContent>
        <SidebarGroup>
          <SidebarLabel boardsCount={userBoards?.length} />
          <SidebarGroupContent>
            <Suspense fallback={<SidebarMenuSkeleton showIcon />}>
              <BoardsList boards={userBoards} />
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
