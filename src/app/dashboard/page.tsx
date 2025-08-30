import { after } from "next/server";
import { unauthorized } from "next/navigation";
import type { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { FolderKanban, Layout, PlusCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { insertUserAction } from "@/actions/user";
import BoardModal from "./components/board/board-modal";

const Dashboard = async () => {
  const user = await currentUser();

  if (!user) unauthorized();

  after(() => {
    insertUserAction({
      id: user.id,
      name: user.fullName,
      email: user.emailAddresses[0].emailAddress,
    }).catch((error) => console.error("Failed to insert user:", error));
  });

  return (
    <section className="relative right-3 grow place-content-center">
      <Card className="bg-background border-none text-center shadow-none">
        <CardHeader>
          <CardTitle className="text-gradient flex flex-col items-center gap-4 text-xl md:text-3xl">
            <FolderKanban size={32} className="text-primary" />
            Welcome to Your Workspace
          </CardTitle>
          <CardDescription className="text-sm md:text-base">
            Get started by creating your first board to organize your projects
            and tasks efficiently.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BoardModal
            mode="create"
            trigger={
              <button>
                <PlusCircle className="transition-transform group-hover:rotate-90" />
                Create your first board
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
