import UserAvatar from "./components/user-avatar";
import KanbanLogo from "./components/kanban-logo";
import SignInButton from "./components/sign-in-btn";

const Header = () => {
  const isAuthenticated = true;

  return (
    <header>
      <nav className="fixed left-0 right-0 top-0 z-50 border-b bg-background/80 drop-shadow-sm backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <KanbanLogo />
          {isAuthenticated && <UserAvatar />}
          {!isAuthenticated && <SignInButton />}
        </div>
      </nav>
    </header>
  );
};

export default Header;
