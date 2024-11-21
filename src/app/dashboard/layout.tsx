import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./components/sidebar/dashboard-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <DashboardSidebar />
      <SidebarTrigger className="fixed left-2 top-[70px] md:relative" />
      {children}
    </SidebarProvider>
  );
}
