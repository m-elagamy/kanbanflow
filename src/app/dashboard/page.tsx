import { redirect, unauthorized } from "next/navigation";
import type { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { FolderKanban, PlusCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserOnboardingStateAction } from "@/actions/user";
import BoardModal from "./components/board/board-modal";

const Dashboard = async () => {
  const user = await currentUser();

  if (!user) unauthorized();

  const onboardingState = await getUserOnboardingStateAction();

  const boardsCount = onboardingState.fields?.boardsCount ?? 0;
  const hasCreatedBoardOnce =
    onboardingState.fields?.hasCreatedBoardOnce ?? false;

  if (boardsCount === 0 && !hasCreatedBoardOnce) redirect("/welcome");

  const isEmptyAfterFirstBoard = boardsCount === 0 && hasCreatedBoardOnce;

  return (
    <section className="relative right-3 grow place-content-center">
      <Card className="bg-background border-none text-center shadow-none">
        <CardHeader>
          <CardTitle className="text-gradient flex flex-col items-center gap-4 text-xl md:text-3xl">
            <FolderKanban size={32} className="text-primary" />
            {isEmptyAfterFirstBoard
              ? "No boards yet"
              : "Choose a board to continue"}
          </CardTitle>
          <CardDescription className="text-sm md:text-base">
            {isEmptyAfterFirstBoard
              ? "Create a new board to start organizing tasks and projects again."
              : "Select a board from the sidebar or create a new one to get started."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BoardModal
            mode="create"
            trigger={
              <button>
                <PlusCircle className="transition-transform group-hover:rotate-90" />
                {isEmptyAfterFirstBoard
                  ? "Create a new board"
                  : "Create another board"}
              </button>
            }
            modalId="dashboard-new-board"
          />
        </CardContent>
      </Card>
    </section>
  );
};

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Track tasks, manage projects, and stay organized with KanbanFlow's dashboard.",
};

export default Dashboard;
