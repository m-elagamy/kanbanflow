"use client";

import { ListTodo } from "lucide-react";

interface DashboardStatsProps {
  openTasks: number;
}

const stats = (values: DashboardStatsProps) => [
  {
    label: "Open Tasks",
    value: values.openTasks,
    icon: ListTodo,
    color: "text-blue-500",
  },
];

export default function DashboardStats(props: DashboardStatsProps) {
  return (
    <section
      aria-label="Workspace overview"
      className="text-muted-foreground flex items-center gap-2 px-1"
    >
      {stats(props).map(
        ({ label, value, icon: Icon, color }) => (
        <div
          key={label}
          className="flex items-center gap-2.5"
        >
            <Icon
              className={`${color} size-4 shrink-0`}
              aria-hidden="true"
            />
            <div className="flex items-baseline gap-1.5 whitespace-nowrap">
              <p className="text-foreground text-sm leading-none font-semibold">
                {value}
              </p>
              <p className="text-xs leading-tight">
                {label}
              </p>
            </div>
        </div>
        ),
      )}
    </section>
  );
}
