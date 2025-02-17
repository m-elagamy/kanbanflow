"use client";

import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TaskPriorityFilter() {
  return (
    <Select>
      <SelectTrigger className="hover:bg-muted-foreground/5">
        <Filter size={14} className="text-muted-foreground" />
        <SelectValue placeholder="Filter" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel className="text-xs text-muted-foreground">
            Tasks Priority
          </SelectLabel>
          <SelectItem value="all">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-foreground" />
              All Tasks
            </div>
          </SelectItem>
          <SelectItem value="high">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-red-500" />
              High
            </div>
          </SelectItem>
          <SelectItem value="medium">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-yellow-500" />
              Medium
            </div>
          </SelectItem>
          <SelectItem value="low">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-green-500" />
              Low
            </div>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
