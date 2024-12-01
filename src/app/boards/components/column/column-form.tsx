import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import delay from "@/utils/delay";
import columnFormSchema from "@/validations/column-schema";
import generateUniqueID from "@/utils/generate-unique-ID";
import useKanbanStore from "@/stores/use-kanban-store";
import stateOptions from "../../data/column-state-options";

type FormData = z.infer<typeof columnFormSchema>;

export default function ColumnForm({
  setIsModalOpen,
}: {
  setIsModalOpen: (isOpen: boolean) => void;
}) {
  const { addColumn, currentBoardId } = useKanbanStore();

  const form = useForm<FormData>({
    resolver: zodResolver(columnFormSchema),
    defaultValues: {
      state: "Backlog",
    },
  });

  const onSubmit = async (data: FormData) => {
    await delay(250);
    addColumn(currentBoardId as string, {
      id: generateUniqueID(),
      title: data.state,
      tasks: [],
    });
    setIsModalOpen(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Column State</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a state" />
                  </SelectTrigger>
                  <SelectContent>
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
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <DialogFooter>
          <Button disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader className="animate-spin" />}
            Add Column
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
