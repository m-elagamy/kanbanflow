import { Github, Globe } from "lucide-react";
import { Button } from "./ui/button";

const Footer = () => {
  const links = [
    {
      href: "https://agamy.netlify.app",
      icon: <Globe />,
      label: "Portfolio",
    },
    {
      href: "https://github.com/Mahmoud-Elagamy/kanban-app",
      icon: <Github />,
      label: "GitHub",
    },
  ];

  return (
    <footer className="border-t py-8 text-center">
      <div className="container">
        <div className="flex flex-col justify-center gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              © 2024 KanbanFlow. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Designed and developed by{" "}
              <a
                href="https://www.linkedin.com/in/mahmoudelagamy/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 transition-colors hover:text-primary"
              >
                Mahmoud Elagamy
              </a>
              .
            </p>
          </div>
          <div className="flex items-center justify-center gap-2">
            {links.map((link, index) => (
              <div key={index}>
                <Button variant="link" size="sm" asChild>
                  <a href={link.href} target="_blank" rel="noopener noreferrer">
                    {link.icon}
                    <span className="font-medium">{link.label}</span>
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
