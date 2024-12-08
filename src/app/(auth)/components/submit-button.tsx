import * as Clerk from "@clerk/elements/common";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SubmitButton({
  isGlobalLoading,
}: {
  isGlobalLoading: boolean;
}) {
  return (
    <Button disabled={isGlobalLoading}>
      <Clerk.Loading>
        {(isLoading) => {
          return isLoading ? <Loader className="animate-spin" /> : "Continue";
        }}
      </Clerk.Loading>
    </Button>
  );
}
