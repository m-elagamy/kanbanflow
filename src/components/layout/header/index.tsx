"use client";

import { useState } from "react";
import { Moon, Sun } from "lucide-react";

import UserAvatar from "./components/user-avatar";
import KanbanLogo from "./components/kanban-logo";
import SignInButton from "./components/sign-in-btn";
import { Button } from "@/components/ui/button";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";

const isAuthenticated = true;

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
    <motion.header initial={{ y: -70 }} animate={{ y: 0 }}>
      <nav
        className={`fixed left-0 right-0 top-0 z-50 backdrop-blur-sm ${
          isScrolled
            ? "bg-background/80 drop-shadow-sm backdrop-blur-sm"
            : "bg-transparent"
        }`}
      >
        <div className="container flex h-16 items-center justify-between">
          <KanbanLogo />

          <div className="flex items-center gap-4">
            {isAuthenticated ? <UserAvatar /> : <SignInButton />}
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
      </nav>
    </motion.header>
  );
};

export default Header;
