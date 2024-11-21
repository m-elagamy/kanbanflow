import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BoardCreationDialog from "./components/modals/board-creation-modal";

const Dashboard = () => {
  return (
    <section className="grid flex-grow place-content-center">
      <Card className="border-none text-center shadow-none">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">
            Welcome to Your Workspace
          </CardTitle>
          <CardDescription>
            Let&apos;s create your first board and start organizing your work.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BoardCreationDialog />
        </CardContent>
      </Card>
    </section>
  );
};
export default Dashboard;
