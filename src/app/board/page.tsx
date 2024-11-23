import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BoardCreationModal from "./components/modals/board-creation";

const Dashboard = () => {
  return (
    <section className="relative right-[10px] grid h-dvh flex-grow place-content-center">
      <Card className="border-none text-center shadow-none">
        <CardHeader>
          <CardTitle className="text-xl md:text-3xl">
            Welcome to Your Workspace
          </CardTitle>
          <CardDescription>
            Let&apos;s create your first board and start organizing your work.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BoardCreationModal />
        </CardContent>
      </Card>
    </section>
  );
};
export default Dashboard;
