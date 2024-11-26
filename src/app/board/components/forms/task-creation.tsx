import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import AddTaskSchema from "@/validations/task-schema";
import useBoardStore from "@/store/useBoardStore";
import { formatTags } from "../../utils/format-tags";
import getBadgeStyle from "../../utils/get-badge-style";
import taskPriorities from "../../data/task-priorities";
import generateUniqueID from "@/utils/generate-unique-ID";
import delay from "@/utils/delay";

type AddTaskFormValues = z.infer<typeof AddTaskSchema>;
type TaskCreationFormProps = {
  columnId: string;
  setIsModalOpen: (isOpen: boolean) => void;
};

const TaskCreationForm = ({
  columnId,
  setIsModalOpen,
}: TaskCreationFormProps) => {
  const { addTask, currentBoardId } = useBoardStore();

  const form = useForm<AddTaskFormValues>({
    resolver: zodResolver(AddTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      tags: "",
    },
  });

  const handleAddTask = async (data: AddTaskFormValues) => {
    await delay(250);
    addTask(currentBoardId as string, columnId, {
      id: generateUniqueID(),
      title: data.title,
      description: data.description,
      priority: data.priority,
      tags: formatTags(data.tags),
    });
    setIsModalOpen(false);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleAddTask)} className="space-y-4">
        {/* Title Field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                What&apos;s the task?{" "}
                <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Create a stunning new landing page"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What needs to be done?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Design a modern, mobile-friendly layout for the homepage"
                  {...field}
                  className="resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Priority Field */}
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How urgent is this?</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="*:max-w-[120px]">
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {taskPriorities.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        <div className="flex items-center">
                          <span
                            className={`mr-2 h-2 w-2 rounded-full ${getBadgeStyle(
                              priority,
                            )}`}
                          ></span>
                          <h2 className="text-xs font-semibold capitalize md:text-sm">
                            {priority}
                          </h2>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tags Field */}
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What&apos;s the category?</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., design, development, marketing"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="text-end">
          <Button className="p-2 md:p-3" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader className="animate-spin" />}
            Add Task
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TaskCreationForm;
