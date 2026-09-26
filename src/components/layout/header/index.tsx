import AuthButtons from "./auth-buttons";
import HeaderScrollShell from "./header-scroll-shell";
import KanbanLogo from "./kanban-logo";

type HeaderUser = { fullName: string | null; firstName: string | null; imageUrl: string };

const Header = ({ user }: { user: HeaderUser | null }) => {
  return (
    <HeaderScrollShell>
      <div className="container !max-w-[1440px] flex h-full items-center justify-between">
        <div className="flex min-w-0 items-center gap-9">
          <KanbanLogo size="compact" className="mx-0 shrink-0" />
          <nav
            aria-label="Landing page"
            className="hidden items-center gap-7 lg:flex"
          >
            <a
              href="#how-it-works"
              className="text-foreground/75 hover:text-foreground focus-visible:outline-ring text-sm font-medium transition-colors outline-offset-4 focus-visible:outline-2"
            >
              How it works
            </a>
            <a
              href="#features"
              className="text-foreground/75 hover:text-foreground focus-visible:outline-ring text-sm font-medium transition-colors outline-offset-4 focus-visible:outline-2"
            >
              Product
            </a>
          </nav>
        </div>
        <AuthButtons user={user} />
      </div>
    </HeaderScrollShell>
  );
};

export default Header;
