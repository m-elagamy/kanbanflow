"use client";

import { useState } from "react";
import { Moon, Sun } from "lucide-react";

import UserAvatar from "./components/user-avatar";
import KanbanLogo from "./components/kanban-logo";
import SignInButton from "./components/sign-in-btn";
import { Button } from "@/components/ui/button";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathName = usePathname();
  const { theme, setTheme } = useTheme();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  const isHomePage = pathName === "/";

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 10);
  });

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header
      className={`sticky top-0 z-50 h-16 backdrop-blur-sm transition-colors ${isScrolled ? "border-b bg-background/50" : ""}`}
    >
      <div className="container flex h-full items-center justify-between">
        <KanbanLogo />

        <div className="flex items-center gap-4">
          {isHomePage ? <SignInButton /> : <UserAvatar />}
          <Button variant="outline" size="icon" onClick={toggleTheme}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
      {!isHomePage && (
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#3F8DA0]/50 to-transparent opacity-50 dark:via-[#4f637399]" />
      )}
    </header>
  );
};

export default Header;
