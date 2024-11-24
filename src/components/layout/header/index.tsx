"use client";

import UserAvatar from "./components/user-avatar";
import KanbanLogo from "./components/kanban-logo";
import SignInButton from "./components/sign-in-btn";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

const Header = () => {
  const { theme, setTheme } = useTheme();

  const isAuthenticated = true;

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <motion.header initial={{ y: -70 }} animate={{ y: 0 }}>
      <nav className={`fixed left-0 right-0 top-0 z-50 backdrop-blur-sm`}>
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
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#3F8DA0]/50 to-transparent opacity-50 dark:via-[#4F6373]" />
      </nav>
    </motion.header>
  );
};

export default Header;
