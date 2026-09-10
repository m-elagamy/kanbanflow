"use client";

import { motion } from "motion/react";
import { LayoutDashboard, ListTodo, AlertCircle } from "lucide-react";

interface DashboardStatsProps {
  totalBoards: number;
  totalTasks: number;
  highPriorityTasks: number;
}

const stats = (values: DashboardStatsProps) => [
  {
    label: "Total Boards",
    value: values.totalBoards,
    icon: LayoutDashboard,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: "Total Tasks",
    value: values.totalTasks,
    icon: ListTodo,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    label: "High Priority",
    value: values.highPriorityTasks,
    icon: AlertCircle,
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
];

export default function DashboardStats(props: DashboardStatsProps) {
  return (
    <section
      aria-label="Workspace overview"
      className="grid grid-cols-3 gap-2 sm:gap-4"
    >
      {stats(props).map(({ label, value, icon: Icon, color, bg }, index) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
            delay: 0.1 + index * 0.07,
          }}
          className="border-border/60 bg-background/80 flex min-w-0 flex-col gap-3 rounded-xl border p-3 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:p-4"
        >
          <span
            className={`${bg} ${color} flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-10 sm:w-10`}
          >
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-foreground text-xl leading-none font-semibold sm:text-2xl">
              {value}
            </p>
            <p className="text-muted-foreground mt-1 text-xs leading-tight sm:text-sm">
              {label}
            </p>
          </div>
        </motion.div>
      ))}
    </section>
  );
}
