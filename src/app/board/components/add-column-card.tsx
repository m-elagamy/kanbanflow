import React from "react";
import { PlusCircle } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import useBoardStore from "@/store/useBoardStore";

const AddColumnCard = () => {
  const { getCurrentBoard } = useBoardStore();
  const currentBoard = getCurrentBoard();

  const columnsCount = currentBoard?.columns?.length ?? 0;

  if (columnsCount >= 10) return null;

  return (
    <Card className="group relative flex h-full w-72 min-w-72 cursor-pointer flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 bg-background/50 transition-all duration-300 hover:border-primary/50 hover:bg-accent/10">
      <CardContent>
        <div className="group/icon relative rounded-xl bg-background p-3 shadow-lg ring-1 ring-black/[0.2] transition-all duration-300 group-hover:shadow-primary/20 group-hover:ring-primary/30 dark:bg-card dark:ring-white/[0.09]">
          <PlusCircle className="size-6 text-muted-foreground/50 transition-colors duration-300 group-hover:text-primary" />

          <div className="absolute -right-0.5 -top-0.5">
            <div className="size-2 rounded-full bg-primary/50 opacity-0 blur-[4px] transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-muted-foreground">
        {columnsCount === 0 ? "Create Your First Column" : "New Column"}
      </CardFooter>
    </Card>
  );
};

export default AddColumnCard;
