import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { WorkspaceSidebar } from "../../components/layout/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <WorkspaceSidebar />
      <SidebarTrigger className="relative left-3 top-5 z-50 md:left-2 md:top-[70px]" />
      {children}
    </SidebarProvider>
  );
}
