import { unauthorized } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { Layout } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BoardModal from "./components/board/board-modal";
import type { Metadata } from "next";
// import { insertUserAction } from "@/actions/user";

export const metadata: Metadata = {
  title: "Dashboard",
};

const Dashboard = async () => {
  const authUser = await currentUser();

  if (!authUser) {
    unauthorized();
  }

  // await insertUserAction({
  //   id: authUser.id,
  //   email: authUser.emailAddresses[0].emailAddress,
  //   name: authUser.fullName,
  // });

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
          <BoardModal mode="create" />
        </CardContent>
      </Card>
    </section>
  );
};
export default Dashboard;
