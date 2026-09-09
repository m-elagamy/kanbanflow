import * as SignIn from "@clerk/elements/sign-in";
import * as SignUp from "@clerk/elements/sign-up";
import { Button } from "@/components/ui/button";

export default function ResendCodeButton({
  mode,
  isGlobalLoading,
}: {
  mode: "sign-in" | "sign-up";
  isGlobalLoading: boolean;
}) {
  const Action = mode === "sign-up" ? SignUp.Action : SignIn.Action;

  return (
    <Action
      asChild
      resend
      className="text-muted-foreground"
      fallback={({ resendableAfter }: { resendableAfter: number }) => (
        <Button type="button" variant="link" size="sm" disabled>
          Didn&apos;t receive a code? Resend (
          <span className="tabular-nums">{resendableAfter}</span>)
        </Button>
      )}
    >
      <Button type="button" variant="link" size="sm" disabled={isGlobalLoading}>
        Didn&apos;t receive a code? Resend
      </Button>
    </Action>
  );
}
