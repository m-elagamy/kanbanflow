"use client";

import { Button } from "@/components/ui/button";
import { links } from "./data";
import KanbanLogo from "../header/kanban-logo";
import { ThemeSwitcher } from "./theme-switcher";

const currentYear = new Date().getFullYear();

const Footer = () => {
  return (
    <footer className="border-border bg-card/50 border-t" role="contentinfo">
      <div className="container py-12">
        {/* Brand Section */}
        <div className="flex flex-col gap-6">
          <KanbanLogo />
          <p className="text-muted-foreground max-w-md text-sm">
            Streamline your workflow with an intuitive Kanban board. Organize
            tasks, boost productivity, and achieve more.
          </p>
          <div className="flex items-center gap-2">
            {links.map((link, index) => {
              const Icon = link.icon;
              return (
                <Button
                  className="text-muted-foreground hover:text-primary hover:bg-primary/10 h-9 w-9 rounded-full transition-all duration-200"
                  variant="ghost"
                  size="icon"
                  asChild
                  key={index}
                >
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="sr-only">{link.label}</span>
                  </a>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-border/50 mt-10 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <p className="text-muted-foreground text-sm">
            © {currentYear} KanbanFlow. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
