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
        <SidebarMenuItem key={index}>
          <SidebarMenuSkeleton className="pr-0" showIcon />
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
