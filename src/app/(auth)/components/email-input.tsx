import * as Clerk from "@clerk/elements/common";
import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EmailInput({ inputName }: { inputName: string }) {
  return (
    <Clerk.Field name={inputName} className="space-y-2">
      <Clerk.Label asChild>
        <Label className="flex items-center gap-1">
          <Mail size={14} />
          Email address
        </Label>
      </Clerk.Label>
      <Clerk.Input type="email" placeholder="name@example.com" required asChild>
        <Input />
      </Clerk.Input>
      <Clerk.FieldError className="block text-sm text-destructive" />
    </Clerk.Field>
  );
}
