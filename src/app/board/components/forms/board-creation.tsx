"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import boardSchema from "@/schemas/board-schema";
import FormData from "@/lib/types/board-creation-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useBoardStore from "@/store/useBoardStore";
import type Column from "@/lib/types/column";
import { Loader } from "lucide-react";

const templates = [
  {
    id: "personal",
    title: "Personal Productivity",
    description: "Track personal tasks and goals",
    columns: ["To Do", "In Progress", "Completed"],
  },
  {
    id: "agile",
    title: "Agile Development",
    description: "Manage software development workflow",
    columns: ["Backlog", "To Do", "In Progress", "Review", "Done"],
  },
  {
    id: "custom",
    title: "Custom Workflow",
    description: "Create your own unique workflow",
    columns: [],
  },
];

const BoardCreationForm = () => {
  const router = useRouter();
  const { addBoard } = useBoardStore();
  const generateUniqueId = () => uuidv4();

  const form = useForm<FormData>({
    resolver: zodResolver(boardSchema),
    defaultValues: {
      title: "",
      description: "",
      template: "",
    },
  });

  const addBoardToStore = (board: {
    title: string;
    description?: string;
    columns: Column[];
  }) => {
    addBoard({
      id: generateUniqueId(),
      title: board.title,
      description: board.description,
      columns: board.columns,
    });
  };

  const onSubmit = (data: FormData) => {
    const { title, template, description } = data;

    const selectedTemplate = templates.find((t) => t.id === template);

    if (selectedTemplate) {
      const columns = selectedTemplate.columns.map((columnTitle) => ({
        id: generateUniqueId(), // Generate unique ID for the column
        title: columnTitle,
        tasks: [], // Start with an empty task list
      }));

      const encodedTitle = encodeURIComponent(
        title.replace(/\s+/g, "-").toLowerCase().trim(),
      );

      addBoardToStore({ title, description, columns });

      router.push(`/board/${encodedTitle}`);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Board Name */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Board Name <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="e.g., Personal Tasks" {...field} />
              </FormControl>
              <FormDescription>
                Choose a clear and descriptive name for your board.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Template Selection */}
        <FormField
          control={form.control}
          name="template"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Board Template <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="*:max-w-[105px]">
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        <h2 className="text-xs font-semibold">
                          {template.title}
                        </h2>
                        <p
                          className={`text-[0.625rem] text-muted-foreground md:text-xs`}
                        >
                          {template.description}
                        </p>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                Start with a ready-made template or customize it later.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Board Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Board Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="Organize my daily and work tasks"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Add context to help you remember the board&apos;s purpose.
              </FormDescription>
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <DialogFooter>
          <Button disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader className="animate-spin" />}
            Confirm
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default BoardCreationForm;
