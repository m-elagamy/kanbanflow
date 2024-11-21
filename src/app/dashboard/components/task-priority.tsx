import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const priority = ["low", "medium", "high"];

const TaskPriority = ({
  setPriority,
}: {
  setPriority: (priority: string) => void;
}) => {
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      className="flex-row-reverse justify-end"
      onValueChange={setPriority}
    >
      {priority.map((item) => (
        <ToggleGroupItem value={item} key={item} className="capitalize">
          {item}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};

export default TaskPriority;
