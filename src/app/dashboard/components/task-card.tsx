import { Badge } from "@/components/ui/badge";
import getBadgeStyle from "../utils/get-badge-style";
import Task from "@/lib/types/task";

export default function TaskCard({ task }: { task: Task }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent/25">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium md:text-base">{task.title}</h3>
          <Badge
            className={`${getBadgeStyle(task.priority)} pointer-events-none rounded-full px-2 text-[0.625rem] uppercase tracking-wider`}
          >
            {task.priority}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">{task.description}</p>
        {task.tags.length > 0 &&
          task.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="mr-1 text-xs">
              {tag}
            </Badge>
          ))}
      </div>
    </div>
  );
}
