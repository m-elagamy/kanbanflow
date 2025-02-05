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
import BoardModal from "./components/board/board-modal";
import insertUserData from "./utils/insert-user-data";

export async function generateMetadata(): Promise<Metadata> {
  const user = await currentUser();

  if (!user) {
    return {
      title: "Access Denied",
      description:
        "You do not have permission to view this page. Please log in or return to the homepage.",
    };
  }

  return {
    title: "Dashboard",
    description: "Manage your tasks and projects with ease using KanbanFlow.",
  };
}

const Dashboard = async () => {
  const user = await currentUser();

  if (!user) {
    unauthorized();
  }

  // Insert user data into the database when the user logs in for the first time.
  insertUserData(user.id, user.fullName, user.emailAddresses[0].emailAddress);

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
          />
        </CardContent>
      </Card>
    </section>
  );
};
export default Dashboard;
