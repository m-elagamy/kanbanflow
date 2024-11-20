import KanbanLogo from "@/components/header/components/kanban-logo";
import NavigationButtons from "@/components/header/components/navigation-buttons";

const Header = () => {
  return (
    <header>
      <nav className="fixed left-0 right-0 top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <KanbanLogo />
          <NavigationButtons />
        </div>
      </nav>
    </header>
  );
};

export default Header;
