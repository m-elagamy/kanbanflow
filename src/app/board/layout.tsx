import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./components/sidebar/dashboard-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <DashboardSidebar />
      <SidebarTrigger className="relative left-3 top-5 z-50 md:left-2 md:top-[70px]" />
      {children}
    </SidebarProvider>
  );
}
