import { ChevronRight, ListTodo } from "lucide-react";
import Link from "next/link";

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
      className="text-muted-foreground pt-1 flex items-center gap-2 px-1"
    >
      {stats(props).map(
        ({ label, value, icon: Icon, color }) => (
        <Link
          key={label}
          href="/dashboard/tasks?attention=open&page=1"
          aria-label={`View ${value} open tasks`}
          className="group flex cursor-pointer items-center gap-2.5 rounded-md outline-none transition-colors duration-150 hover:text-foreground focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
            <Icon
              className={`${color} size-4 shrink-0 opacity-80 transition-opacity group-hover:opacity-100`}
              aria-hidden="true"
            />
            <div className="flex items-baseline gap-1.5 whitespace-nowrap">
              <p className="text-foreground text-sm leading-none font-semibold">
                {value}
              </p>
              <p className="text-xs leading-tight transition-colors group-hover:text-foreground">
                {label}
              </p>
            </div>
            <ChevronRight
              className="text-muted-foreground/60 size-3.5 shrink-0 transition-[color,transform] duration-150 group-hover:translate-x-0.5 group-hover:text-muted-foreground rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
        </Link>
        ),
      )}
    </section>
  );
}
