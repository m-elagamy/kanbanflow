import { cookies } from "next/headers";
import DashboardSidebar from "@/components/layout/sidebar";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <DashboardSidebar />
      <SidebarTrigger className="relative -top-11 left-3 z-50 md:top-2" />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
