import { PlusCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const AddColumnCard = ({ onClick }: { onClick: () => void }) => {
  return (
    <Card
      className="group relative flex h-full max-h-[500px] w-64 min-w-64 cursor-pointer snap-start flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 bg-background/50 transition-all duration-300 hover:border-primary/50 hover:bg-accent/10 md:w-72 md:min-w-72"
      onClick={onClick}
    >
      <CardContent>
        <div className="group/icon relative rounded-xl bg-background p-3 shadow-lg ring-1 ring-black/[0.2] transition-all duration-300 group-hover:shadow-primary/20 group-hover:ring-primary/30 dark:bg-card dark:ring-white/[0.09]">
          <PlusCircle className="size-6 text-muted-foreground/50 transition-colors duration-300 group-hover:text-primary" />

          <div className="absolute -right-0.5 -top-0.5">
            <div className="size-2 rounded-full bg-primary/50 opacity-0 blur-[4px] transition-opacity duration-300 group-hover:opacity-100" />
          </div>
          <span className="sr-only">New Column</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddColumnCard;
