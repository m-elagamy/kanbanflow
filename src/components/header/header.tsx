import KanbanLogo from "@/components/header/components/kanban-logo";
import NavigationButtons from "@/components/header/components/navigation-buttons";
import UserAvatar from "./components/user-avatar";

const Header = () => {
  const isAuthenticated = true;

  return (
    <header>
      <nav className="fixed left-0 right-0 top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <KanbanLogo />
          {isAuthenticated && <UserAvatar />}
          {!isAuthenticated && <NavigationButtons />}
        </div>
      </nav>
    </header>
  );
};

export default Header;
