import { Layout } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BoardModal from "./components/board/board-modal";

const Boards = () => {
  return (
    <section className="relative right-3 grid flex-grow place-content-center">
      <Card className="border-none text-center shadow-none">
        <CardHeader>
          <CardTitle className="text-gradient flex flex-col items-center gap-4 text-xl md:text-3xl">
            <Layout size={32} className="text-primary" />
            Welcome to Your Workspace
          </CardTitle>
          <CardDescription className="text-sm md:text-base">
            Let&apos;s create your first board and start organizing your work.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BoardModal mode="create" />
        </CardContent>
      </Card>
    </section>
  );
};
export default Boards;
