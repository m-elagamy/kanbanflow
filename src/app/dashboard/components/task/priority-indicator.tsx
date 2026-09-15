import { cn } from "@/lib/utils";
import taskPriorities from "../../data/task-priorities";
import getPriorityIconColor from "../../utils/get-priority-icon-color";

type PriorityIndicatorProps = {
  priority: string;
  showLabel?: boolean;
  className?: string;
};

export default function PriorityIndicator({
  priority,
  showLabel = true,
  className,
}: PriorityIndicatorProps) {
  const option = taskPriorities.find((item) => item.id === priority);
  const PriorityIcon = option?.icon ?? taskPriorities[1].icon;
  const label = option?.label ?? priority;

  return (
    <span
      className={cn(
        "text-muted-foreground inline-flex items-center gap-1 text-xs",
        className,
      )}
      title={`${label} priority`}
      aria-label={`${label} priority`}
    >
      <PriorityIcon
        size={14}
        className={getPriorityIconColor(priority)}
        aria-hidden="true"
      />
      <span className={showLabel ? undefined : "sr-only"}>{label}</span>
    </span>
  );
}
