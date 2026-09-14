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
      className="grid grid-cols-2 gap-2 sm:gap-4"
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
            className="border-border/80 bg-background/80 flex min-w-0 flex-col gap-3 rounded-xl border p-3 shadow-sm sm:flex-row sm:items-center sm:p-4"
          >
            <span
              className={`${bg} ${color} flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-10 sm:w-10`}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-foreground text-xl leading-none font-semibold sm:text-2xl">
                {value}
              </p>
              <p className="text-muted-foreground mt-1 text-xs leading-tight sm:text-sm">
                {label}
              </p>
              <p className="text-muted-foreground mt-1 hidden text-xs md:block">
                {description}
              </p>
            </div>
          </motion.div>
        ),
      )}
    </section>
  );
}
