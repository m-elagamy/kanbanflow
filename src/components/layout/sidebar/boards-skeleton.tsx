import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";

export default function BoardsSkeleton({
  skeletonsLength,
}: {
  skeletonsLength: number;
}) {
  return (
    <SidebarMenu>
      {Array.from({ length: skeletonsLength }).map((_, index) => (
        <SidebarMenuItem key={index} className="flex">
          <SidebarMenuSkeleton className="h-8 flex-1 pr-8" showIcon />
          <div className="absolute top-1 right-1 flex size-6 items-center justify-center group-data-[collapsible=icon]:hidden">
            <span className="bg-sidebar-accent size-4 animate-pulse rounded" />
          </div>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
