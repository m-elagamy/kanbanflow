import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { WorkspaceSidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <WorkspaceSidebar />
      <>
        <SidebarTrigger className="relative -top-11 left-3 z-50 md:top-2" />
        {children}
      </>
    </SidebarProvider>
  );
}
