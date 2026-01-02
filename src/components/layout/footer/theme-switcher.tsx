"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const themes = [
  { value: "light", icon: Sun, label: "Light" },
  { value: "dark", icon: Moon, label: "Dark" },
  { value: "system", icon: Monitor, label: "System" },
] as const;

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const currentTheme = theme || "system";
  const activeIndex = themes.findIndex((t) => t.value === currentTheme);

  return (
    <div className="border-border/50 bg-muted/30 relative inline-flex items-center gap-1 rounded-lg border p-1">
      {/* Animated background indicator */}
      <motion.div
        className="bg-primary/10 absolute rounded-md"
        initial={false}
        animate={{
          x: `calc(${activeIndex} * (2rem + 0.25rem))`,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
        style={{
          width: "2rem",
          height: "2rem",
        }}
      />

      {themes.map(({ icon: Icon, value, label }) => {
        const isActive = currentTheme === value;
        return (
          <button
            key={value}
            onClick={() => {
              setTheme(value);
            }}
            className={cn(
              "relative z-10 flex size-8 items-center justify-center rounded-md transition-all duration-200",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
            aria-label={label}
            aria-pressed={isActive}
          >
            <motion.div
              animate={{
                scale: isActive ? 1.15 : 1,
              }}
              whileTap={{ scale: 0.95 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 17,
              }}
            >
              <Icon className="h-4 w-4" />
            </motion.div>
          </button>
        );
      })}
    </div>
  );
}
