"use client";

import { ListFilter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useTaskFilterStore,
  type PriorityFilterValue,
} from "@/stores/task-filter";
import taskPriorities from "../../data/task-priorities";
import getPriorityIconColor from "../../utils/get-priority-icon-color";

export function TaskPriorityFilter() {
  const { priorityFilter, setPriorityFilter } = useTaskFilterStore();
  const selectedPriority = taskPriorities.find(
    ({ id }) => id === priorityFilter,
  );

  return (
    <Select
      value={priorityFilter}
      onValueChange={(value) => setPriorityFilter(value as PriorityFilterValue)}
    >
      <SelectTrigger
        className="hover:bg-muted-foreground/5 min-w-34 shrink-0"
        aria-label="Filter tasks by priority"
      >
        <SelectValue>
          {selectedPriority ? (
            <span className="flex items-center gap-2">
              <selectedPriority.icon
                size={14}
                className={getPriorityIconColor(selectedPriority.id)}
                aria-hidden="true"
              />
              {selectedPriority.label}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <ListFilter
                size={14}
                className="text-muted-foreground"
                aria-hidden="true"
              />
              All priorities
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel className="text-muted-foreground text-xs">
            Priority
          </SelectLabel>
          <SelectItem value="all">
            <div className="flex items-center gap-2">
              <ListFilter
                size={14}
                className="text-muted-foreground"
                aria-hidden="true"
              />
              All priorities
            </div>
          </SelectItem>
          {taskPriorities
            .slice()
            .reverse()
            .map(({ id, label, icon: Icon }) => (
              <SelectItem key={id} value={id}>
                <div className="flex items-center gap-2">
                  <Icon
                    size={14}
                    className={getPriorityIconColor(id)}
                    aria-hidden="true"
                  />
                  {label}
                </div>
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
