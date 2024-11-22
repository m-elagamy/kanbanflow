import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type TaskPriorityProps = {
  setPriority: (priority: string) => void;
};

const PRIORITY = ["low", "medium", "high"];

const TaskPriority = ({ setPriority }: TaskPriorityProps) => {
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      size="sm"
      className="flex-row-reverse justify-end gap-2"
      onValueChange={setPriority}
      defaultValue={PRIORITY[1]}
    >
      {PRIORITY.map((item) => (
        <ToggleGroupItem value={item} key={item} className="text-xs capitalize">
          {item}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};

export default TaskPriority;
