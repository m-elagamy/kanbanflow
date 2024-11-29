import { Button } from "@/components/ui/button";
import { links } from "./data";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t py-4 text-center">
      <div className="container">
        <div className="flex flex-col justify-center gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              © {currentYear} KanbanFlow. All rights reserved.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <div key={link.label}>
                  <Button
                    className="text-foreground"
                    variant="link"
                    size="sm"
                    asChild
                  >
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon />
                      <span className="font-medium">{link.label}</span>
                    </a>
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
