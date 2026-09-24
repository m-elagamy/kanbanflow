"use client";

import { motion } from "motion/react";
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
    bg: "bg-blue-500/10",
  },
];

export default function DashboardStats(props: DashboardStatsProps) {
  return (
    <section
      aria-label="Workspace overview"
      className="flex h-11 shrink-0 items-center rounded-lg border border-border/80 bg-background/60 px-3"
    >
      {stats(props).map(
        ({ label, value, icon: Icon, color, bg }, index) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
              delay: 0.1 + index * 0.07,
            }}
            className="flex items-center gap-2.5"
          >
            <span
              className={`${bg} ${color} flex size-7 shrink-0 items-center justify-center rounded-md`}
            >
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <div className="flex items-baseline gap-1.5 whitespace-nowrap">
              <p className="text-foreground text-lg leading-none font-semibold">
                {value}
              </p>
              <p className="text-muted-foreground text-[0.625rem] leading-tight tracking-[0.12em] uppercase">
                {label}
              </p>
            </div>
          </motion.div>
        ),
      )}
    </section>
  );
}
