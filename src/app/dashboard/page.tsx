import { after } from "next/server";
import { unauthorized } from "next/navigation";
import type { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { Layout, PlusCircle } from "lucide-react";
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
    <section className="relative right-3 grid flex-grow place-content-center">
      <Card className="border-none text-center shadow-none">
        <CardHeader>
          <CardTitle className="text-gradient flex flex-col items-center gap-4 text-xl md:text-3xl">
            <Layout size={32} className="text-primary" />
            Welcome to Your Workspace
          </CardTitle>
          <CardDescription className="text-sm md:text-base">
            Manage your boards and create new ones.
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
    "Track tasks, manage projects, and stay organized with KanbanFlow’s dashboard.",
};

export default Dashboard;
