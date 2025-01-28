import { Button } from "@/components/ui/button";
import { links } from "./data";

const currentYear = new Date().getFullYear();

const Footer = () => {
  return (
    <footer className="border-t py-4 text-center" role="contentinfo">
      <div className="container">
        <div className="flex flex-col justify-center gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted-foreground">
            © {currentYear} KanbanFlow. All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-1">
            {links.map((link, index) => {
              const Icon = link.icon;
              return (
                <Button
                  className="text-muted-foreground transition-colors hover:text-primary/80"
                  variant="link"
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
                    <Icon />
                    <span className="sr-only">{link.label}</span>
                  </a>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
