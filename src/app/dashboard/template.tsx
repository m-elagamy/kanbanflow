import { SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/layout/sidebar";

export default function DashboardTemplate({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <DashboardSidebar />
      <SidebarTrigger className="relative -top-11 left-3 z-50 md:top-2" />
      {children}
    </>
  );
}
