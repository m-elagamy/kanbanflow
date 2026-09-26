import { cookies } from "next/headers";
import DashboardSidebar from "@/components/layout/sidebar";
import DashboardBreadcrumb from "@/components/layout/dashboard-breadcrumb";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import KeyboardShortcuts from "@/components/layout/keyboard-shortcuts";
import OfflineStatus from "./components/offline-status";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen} className="bg-muted">
      <DashboardSidebar />
      <SidebarInset className="border-border/60 min-h-0 min-w-0 border">
        <header className="border-border/60 bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-40 flex h-12 shrink-0 items-center gap-3 border-b px-4 backdrop-blur md:rounded-t-xl">
          <SidebarTrigger />
          <DashboardBreadcrumb />
          <div className="ml-auto">
            <KeyboardShortcuts />
          </div>
        </header>
        <OfflineStatus />
        <div className="min-h-0 min-w-0 flex-1 overflow-auto">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
