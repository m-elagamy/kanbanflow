import { Suspense } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import SidebarTitle from "./sidebar-title";
import SidebarActions from "./sidebar-actions";
import { UserProfile } from "./user-profile";
import BoardsSection from "./boards-section";
import BoardsSkeleton from "./boards-skeleton";

export default function DashboardSidebar() {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarTitle />
      <SidebarContent>
        <SidebarGroup>
          <Suspense
            fallback={
              <>
                <SidebarGroupLabel className="flex-row justify-between pr-0 uppercase">
                  <Skeleton className="h-3 w-14" />
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <BoardsSkeleton skeletonsLength={5} />
                </SidebarGroupContent>
              </>
            }
          >
            <BoardsSection />
          </Suspense>
        </SidebarGroup>
        <SidebarActions />
      </SidebarContent>
      <SidebarFooter>
        <UserProfile />
      </SidebarFooter>
    </Sidebar>
  );
}
