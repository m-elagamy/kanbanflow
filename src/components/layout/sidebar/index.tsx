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
import { getUserBoardsAction } from "@/actions/user";
import { unauthorized } from "next/navigation";
import { Suspense } from "react";

export async function WorkspaceSidebar() {
  const authUser = await currentUser();

  if (!authUser) {
    unauthorized();
  }

  const userBoards = (await getUserBoardsAction(authUser?.id)).userWithBoards
    ?.boards;

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
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
