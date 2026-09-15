"use client";

import { Keyboard } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Shortcut = ({ label, keys }: { label: string; keys: string }) => (
  <div className="flex items-center justify-between gap-8 px-2 py-1.5 text-sm">
    <span>{label}</span>
    <kbd className="bg-muted text-muted-foreground rounded border px-1.5 py-0.5 font-mono text-[0.625rem]">
      {keys}
    </kbd>
  </div>
);

export default function KeyboardShortcuts() {
  const pathname = usePathname();
  const isDashboardHome = pathname === "/dashboard";
  const isBoardPage = /^\/dashboard\/(?!boards$|tasks$)[^/]+$/.test(pathname);
  const hasTaskSearch = isDashboardHome || isBoardPage;

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-10 md:size-8"
              aria-label="Keyboard shortcuts"
            >
              <Keyboard aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">Keyboard shortcuts</TooltipContent>
      </Tooltip>

      <DropdownMenuContent align="end" className="w-72 p-2">
        <DropdownMenuLabel>Keyboard shortcuts</DropdownMenuLabel>
        {hasTaskSearch && <Shortcut label="Search tasks" keys="Ctrl/Cmd K" />}
        <Shortcut label="Toggle sidebar" keys="Ctrl/Cmd B" />

        {isBoardPage && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Board controls</DropdownMenuLabel>
            <Shortcut label="Pick up or drop" keys="Space" />
            <Shortcut label="Move item" keys="Arrow keys" />
            <Shortcut label="Cancel drag" keys="Esc" />
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
