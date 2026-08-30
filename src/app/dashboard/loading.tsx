import DashboardSkeleton from "./components/board/dashboard-skeleton";

export default function DashboardLoading() {
  return (
    <main className="relative min-h-full overflow-hidden px-6 py-8 md:px-10">
      <section className="relative z-10 mx-auto max-w-5xl">
        <DashboardSkeleton />
      </section>
    </main>
  );
}
