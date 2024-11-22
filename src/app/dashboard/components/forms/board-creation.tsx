"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

  const form = useForm<FormData>({
    resolver: zodResolver(boardSchema),
    defaultValues: {
      title: "",
      description: "",
      template: "",
    },
  });

  const onSubmit = (data: FormData) => {
    const { title } = data;

    const encodedTitle = encodeURIComponent(title);

    router.push(`/dashboard/${encodedTitle}`);
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
                  <SelectTrigger className="*:max-w-[120px]">
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        <h2 className="text-xs font-semibold md:text-sm">
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
          <Button>Confirm</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default BoardCreationForm;
