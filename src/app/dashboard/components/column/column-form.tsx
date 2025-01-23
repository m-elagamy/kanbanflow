import { useActionState } from "react";
import { Loader } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import stateOptions from "../../data/column-state-options";
import { Label } from "@/components/ui/label";
import { createColumnAction } from "@/actions/column";
import { Input } from "@/components/ui/input";

export default function ColumnForm({
  setIsModalOpen,
  boardId,
}: {
  setIsModalOpen: (isOpen: boolean) => void;
  boardId: string;
}) {
  const [state, formAction, isPending] = useActionState(
    createColumnAction,
    boardId,
  );

  return (
    <form action={formAction} className="space-y-4">
      <section className="space-y-2">
        <Input type="hidden" name="boardId" value={state ?? ""} />
        <Label>Select Column State</Label>
        <Select name="state" defaultValue="To Do">
          <SelectTrigger>
            <SelectValue placeholder="Choose a state" />
          </SelectTrigger>
          <SelectContent className="max-h-80">
            {Object.entries(stateOptions).map(
              ([state, { icon: Icon, color }]) => (
                <SelectItem key={state} value={state}>
                  <div className="flex items-center space-x-2">
                    <Icon size={16} color={color} />
                    <span>{state}</span>
                  </div>
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
      </section>

      {/* Submit Button */}
      <DialogFooter className="gap-1">
        <Button
          type="button"
          className="px-2"
          variant="ghost"
          onClick={() => setIsModalOpen(false)}
        >
          Cancel
        </Button>
        <Button className="px-2" disabled={isPending}>
          {isPending && <Loader className="animate-spin" />}
          Add Column
        </Button>
      </DialogFooter>
    </form>
  );
}
