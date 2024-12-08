import * as Clerk from "@clerk/elements/common";
import { Button } from "@/components/ui/button";

type AuthSwitcherProps = {
  message: string;
  linkText: string;
  linkHref: "sign-in" | "sign-up";
};

export default function AuthModeSwitcher({
  message,
  linkText,
  linkHref,
}: AuthSwitcherProps) {
  return (
    <div className="text-center text-sm text-muted-foreground">
      {message}{" "}
      <Button variant="link" size="sm" className="px-0" asChild>
        <Clerk.Link navigate={linkHref}>{linkText}</Clerk.Link>
      </Button>
    </div>
  );
}
