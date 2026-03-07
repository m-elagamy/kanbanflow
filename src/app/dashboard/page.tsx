import { redirect, unauthorized } from "next/navigation";
import type { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import {
  getUserOnboardingStateAction,
  getUserBoardsWithStatsAction,
  getDashboardStatsAction,
} from "@/actions/user";
import BoardsGrid from "./components/board/boards-grid";

const Dashboard = async () => {
  const user = await currentUser();

  if (!user) unauthorized();

  const onboardingState = await getUserOnboardingStateAction();

  const hasCreatedBoardOnce =
    onboardingState.fields?.hasCreatedBoardOnce ?? false;
  const boardsCount = onboardingState.fields?.boardsCount ?? 0;

  if (boardsCount === 0 && !hasCreatedBoardOnce) redirect("/welcome");

  const [boardsResult, statsResult] = await Promise.all([
    getUserBoardsWithStatsAction(),
    getDashboardStatsAction(),
  ]);

  const boards = boardsResult.fields ?? [];
  const stats = statsResult.fields ?? {
    totalBoards: 0,
    totalTasks: 0,
    highPriorityTasks: 0,
  };

  return (
    <main className="relative min-h-full overflow-hidden px-6 py-8 md:px-10">
      {/* <div className="welcome-gradient pointer-events-none absolute inset-0" /> */}
      <section className="relative z-10 mx-auto max-w-5xl">
        <BoardsGrid boards={boards} userName={user.firstName} stats={stats} />
      </section>
    </main>
  );
};

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Track tasks, manage projects, and stay organized with KanbanFlow's dashboard.",
};

export default Dashboard;
