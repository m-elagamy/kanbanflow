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
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
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
          className="border-border/60 bg-background/80 flex items-center gap-4 rounded-xl border p-5 shadow-sm backdrop-blur"
        >
          <span
            className={`${bg} ${color} flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl`}
          >
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-foreground text-2xl leading-none font-semibold md:text-3xl">
              {value}
            </p>
            <p className="text-muted-foreground mt-1 text-sm">{label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
