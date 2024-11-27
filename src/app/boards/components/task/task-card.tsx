import { Badge } from "@/components/ui/badge";
import getBadgeStyle from "../../utils/get-badge-style";
import Task from "@/lib/types/task";
import TaskActions from "./task-actions";

type TaskCardProps = {
  task: Task;
  columnId: string;
};

export default function TaskCard({ task, columnId }: TaskCardProps) {
  return (
    <div className="group max-h-[165px] cursor-grab overflow-y-auto rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent/25 active:cursor-grabbing">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="max-w-[160px] overflow-x-hidden text-ellipsis whitespace-nowrap text-sm font-medium md:text-base">
            {task.title}
          </h3>
          <Badge
            className={`${getBadgeStyle(task.priority)} pointer-events-none rounded-full px-2 text-[0.625rem] uppercase tracking-wider`}
          >
            {task.priority}
          </Badge>
        </div>
        {task.description && (
          <p className="text-xs text-muted-foreground">{task.description}</p>
        )}
        <div className="flex items-center justify-between">
          <div>
            {task.tags.length > 0 &&
              task.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="mr-1 text-xs">
                  {tag}
                </Badge>
              ))}
          </div>
          <TaskActions task={task} columnId={columnId} />
        </div>
      </div>
    </div>
  );
}
