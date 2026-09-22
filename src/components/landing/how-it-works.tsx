"use client";

import { Ellipsis, Flag, GripVertical } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import columnStatusOptions from "@/app/dashboard/data/column-status-options";
import { Badge } from "../ui/badge";

const motionTimes = [0, 0.16, 0.42, 0.52, 0.82, 0.9, 1];

function StaticTask({ title }: { title: string }) {
  return (
    <div className="border-border/80 bg-card rounded-lg border p-3 shadow-xs">
      <div className="flex items-start justify-between gap-2">
        <p className="truncate text-xs font-medium sm:text-sm">{title}</p>
        <Ellipsis className="text-muted-foreground size-3.5 shrink-0" />
      </div>
      <div className="text-muted-foreground mt-3 flex items-center justify-between text-[10px] sm:text-xs">
        <span>Today</span>
        <Flag className="text-primary size-3" aria-label="Medium priority" />
      </div>
    </div>
  );
}

function ColumnHeader({ status }: { status: "To Do" | "In Progress" }) {
  const option = columnStatusOptions[status];
  const Icon = option.icon;

  return (
    <div className="flex items-center justify-between border-b px-3 py-3 sm:px-4">
      <div className="flex min-w-0 items-center gap-2">
        <Icon
          className="size-3.5 shrink-0"
          color={option.color}
          aria-hidden="true"
        />
        <span className="truncate text-xs font-semibold sm:text-sm">
          {status}
        </span>
      </div>
      <Ellipsis className="text-muted-foreground size-3.5 shrink-0" />
    </div>
  );
}

export default function HowItWorks() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="border-border/50 border-t py-20 md:py-24">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1.4fr)] lg:gap-14">
        <div className="max-w-md">
          <Badge
            variant="outline"
            animate={false}
            className="border-primary/20 bg-primary/[0.06] text-foreground/80 mb-6 shadow-none"
          >
            Workflow, in action
          </Badge>
          <h2 className="text-gradient text-3xl font-bold tracking-tighter text-balance md:text-4xl lg:text-5xl">
            From next task to done.
          </h2>
          <p className="text-muted-foreground mt-4 max-w-sm text-base leading-7">
            Move work forward and the board responds with it.
          </p>
        </div>

        <div
          className="border-border/70 bg-muted/10 overflow-hidden rounded-xl border p-3 shadow-[0_24px_70px_-42px_rgba(0,0,0,0.6)] sm:rounded-2xl sm:p-4"
          role="img"
          aria-label="A Kanbamy task moving from To Do to In Progress"
        >
          <div className="border-border/60 bg-background/70 mb-3 flex items-center gap-2 rounded-lg border px-3 py-2.5 sm:mb-4 sm:px-4">
            <span className="bg-primary/10 text-primary ring-primary/15 flex size-7 items-center justify-center rounded-md ring-1">
              <GripVertical className="size-3.5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold sm:text-sm">
                Website refresh
              </p>
              <p className="text-muted-foreground text-[10px] sm:text-xs">
                Move tasks as the work progresses
              </p>
            </div>
          </div>

          <div className="relative grid min-h-56 grid-cols-2 gap-3 sm:min-h-64 sm:gap-4">
            <div className="border-border/70 bg-background/60 overflow-hidden rounded-xl border">
              <ColumnHeader status="To Do" />
              <div className="space-y-2.5 p-2.5">
                <div
                  className="h-[4.75rem] sm:h-[5.25rem]"
                  aria-hidden="true"
                />
                <StaticTask title="Review launch copy" />
              </div>
            </div>

            <div className="border-border/70 bg-background/60 relative overflow-hidden rounded-xl border">
              <ColumnHeader status="In Progress" />
              <div className="space-y-2.5 p-2.5">
                <div
                  className="h-[4.75rem] sm:h-[5.25rem]"
                  aria-hidden="true"
                />
                <StaticTask title="Prepare release notes" />
              </div>
              <motion.div
                className="bg-primary absolute inset-x-3 top-12 h-0.5 rounded-full"
                initial={false}
                animate={
                  shouldReduceMotion
                    ? { opacity: 0.45 }
                    : { opacity: [0, 0, 0.75, 0, 0, 0] }
                }
                transition={{
                  duration: 7.5,
                  repeat: Infinity,
                  times: [0, 0.25, 0.4, 0.56, 0.82, 1],
                }}
                aria-hidden="true"
              />
              <motion.div
                className="border-primary/35 ring-primary/10 pointer-events-none absolute inset-0 rounded-xl border ring-1"
                initial={false}
                animate={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: [0, 0, 0.7, 0.25, 0, 0] }
                }
                transition={{
                  duration: 7.5,
                  repeat: Infinity,
                  times: [0, 0.25, 0.4, 0.58, 0.82, 1],
                }}
                aria-hidden="true"
              />
            </div>

            <motion.div
              className="border-border/80 bg-card absolute top-[3.55rem] z-10 rounded-lg border p-3 text-left shadow-md sm:top-[3.8rem]"
              style={{ width: "calc(50% - 1.25rem)" }}
              initial={false}
              animate={
                shouldReduceMotion
                  ? { left: "calc(50% + 0.5rem)", y: 0, scale: 1, opacity: 1 }
                  : {
                      left: [
                        "0.65rem",
                        "0.65rem",
                        "calc(50% + 0.5rem)",
                        "calc(50% + 0.5rem)",
                        "calc(50% + 0.5rem)",
                        "calc(50% + 0.5rem)",
                        "0.65rem",
                      ],
                      y: [0, -5, -5, 0, 0, 0, 0],
                      scale: [1, 1.025, 1.025, 1, 1, 1, 1],
                      opacity: [1, 1, 1, 1, 1, 0, 0],
                    }
              }
              transition={{
                duration: 7.5,
                repeat: Infinity,
                ease: "easeInOut",
                times: motionTimes,
              }}
            >
              <motion.div
                className="border-primary/50 ring-primary/20 pointer-events-none absolute inset-0 rounded-lg border ring-2"
                initial={false}
                animate={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: [0, 1, 1, 0, 0, 0, 0] }
                }
                transition={{
                  duration: 7.5,
                  repeat: Infinity,
                  times: motionTimes,
                }}
                aria-hidden="true"
              />
              <div className="relative flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium sm:text-sm">
                    Polish responsive states
                  </p>
                  <p className="text-muted-foreground mt-1 hidden truncate text-xs sm:block">
                    Check the board at smaller breakpoints
                  </p>
                </div>
                <Ellipsis className="text-muted-foreground size-3.5 shrink-0" />
              </div>
              <div className="text-muted-foreground relative mt-3 flex items-center justify-between text-[10px] sm:text-xs">
                <span>Today</span>
                <span className="inline-flex items-center gap-1">
                  <Flag className="text-primary size-3" aria-hidden="true" />{" "}
                  High
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
