import DashboardSidebar from "@/components/layout/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarTrigger className="relative -top-11 left-3 z-50 md:top-2" />
      {children}
    </SidebarProvider>
  );
}
