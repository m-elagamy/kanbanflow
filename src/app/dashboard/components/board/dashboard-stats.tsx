"use client";

import { motion } from "motion/react";
import { LayoutDashboard, ListTodo } from "lucide-react";

interface DashboardStatsProps {
  totalBoards: number;
  openTasks: number;
}

const stats = (values: DashboardStatsProps) => [
  {
    label: "Boards",
    value: values.totalBoards,
    description: "Across your workspace",
    icon: LayoutDashboard,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: "Open Tasks",
    value: values.openTasks,
    description: "Still in progress",
    icon: ListTodo,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
];

export default function DashboardStats(props: DashboardStatsProps) {
  return (
    <section
      aria-label="Workspace overview"
      className="grid grid-cols-2 gap-4 sm:gap-8"
    >
      {stats(props).map(
        ({ label, value, description, icon: Icon, color, bg }, index) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
              delay: 0.1 + index * 0.07,
            }}
            className="flex min-w-0 items-center gap-2.5 py-1"
          >
            <span
              className={`${bg} ${color} flex size-8 shrink-0 items-center justify-center rounded-lg`}
            >
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-foreground text-lg leading-none font-semibold sm:text-xl">
                {value}
              </p>
              <p className="text-muted-foreground mt-1 text-xs leading-tight">
                {label}
              </p>
              <p className="text-muted-foreground mt-1 hidden text-[11px] leading-tight md:block">
                {description}
              </p>
            </div>
          </motion.div>
        ),
      )}
    </section>
  );
}
