import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getAuthenticatedUser, getAuthenticatedUserId } from "@/utils/dev-auth";
import {
  getUserOnboardingStateAction,
  getUserBoardsWithStatsAction,
  getDashboardStatsAction,
} from "@/actions/user";
import BoardsGrid from "./components/board/boards-grid";
import { getDashboardFocusTasksAction } from "@/actions/task";

const Dashboard = async () => {
  await getAuthenticatedUserId();

  const [
    user,
    onboardingState,
    boardsResult,
    statsResult,
    focusTasksResult,
  ] = await Promise.all([
    getAuthenticatedUser(),
    getUserOnboardingStateAction(),
    getUserBoardsWithStatsAction(),
    getDashboardStatsAction(),
    getDashboardFocusTasksAction(),
  ]);

  const hasCreatedBoardOnce =
    onboardingState.fields?.hasCreatedBoardOnce ?? false;
  const boardsCount = onboardingState.fields?.boardsCount ?? 0;

  if (boardsCount === 0 && !hasCreatedBoardOnce) redirect("/welcome");

  if (
    !boardsResult.success ||
    !boardsResult.fields ||
    !statsResult.success ||
    !statsResult.fields
  ) {
    throw new Error("Failed to load your dashboard. Please try again.");
  }

  const boards = boardsResult.fields;
  const stats = statsResult.fields;

  return (
    <main className="relative min-h-full overflow-hidden px-4 py-6 sm:px-6 sm:py-8 md:px-10">
      <section className="relative z-10 mx-auto max-w-5xl">
        <BoardsGrid
          boards={boards}
          userName={user.firstName}
          stats={stats}
          focusTasks={
            focusTasksResult.success
              ? (focusTasksResult.fields ?? { items: [], hasMore: false })
              : null
          }
        />
      </section>
    </main>
  );
};

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Track tasks, manage projects, and stay organized with Kanbamy's dashboard.",
};

export default Dashboard;
