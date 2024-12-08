import * as SignIn from "@clerk/elements/sign-in";
import { Button } from "@/components/ui/button";

export default function ResendCodeButton() {
  return (
    <SignIn.Action
      asChild
      resend
      className="text-muted-foreground"
      fallback={({ resendableAfter }) => (
        <Button variant="link" size="sm" disabled>
          Didn&apos;t receive a code? Resend (
          <span className="tabular-nums">{resendableAfter}</span>)
        </Button>
      )}
    >
      <Button variant="link" size="sm">
        Didn&apos;t receive a code? Resend
      </Button>
    </SignIn.Action>
  );
}
