import { FilterX } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function NoMatchingTasksMessage() {
  return (
    <Card className="border-border/50 bg-transparent shadow-none">
      <CardHeader className="text-center">
        <FilterX className="text-muted-foreground/60 mx-auto mb-2 size-5" />
        <CardTitle className="text-sm font-medium">
          No tasks match this filter
        </CardTitle>
        <CardDescription className="text-xs">
          Try a different priority or clear the filter.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
