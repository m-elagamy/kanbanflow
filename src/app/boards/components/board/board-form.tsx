"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
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
import { DialogFooter } from "@/components/ui/dialog";
import boardSchema from "@/validations/board-schema";
import FormData from "@/lib/types/board-creation-form";
import useBoardStore from "@/stores/use-board-store";
import generateUniqueID from "@/utils/generate-unique-ID";
import delay from "@/utils/delay";
import addBoardToStore from "../../utils/add-board-to-store";
import columnsTemplates from "../../data/columns-templates";
import { toast } from "sonner";
import getToastMessage from "../../utils/get-toast-message";
import { useIsMobile } from "@/hooks/use-mobile";

type BoardFormProps = {
  mode: "create" | "edit";
  setIsModalOpen?: (isOpen: boolean) => void;
};

const BoardForm = ({ mode, setIsModalOpen }: BoardFormProps) => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { addBoard, getCurrentBoard, updateBoard } = useBoardStore();

  const currentBoard = mode === "edit" ? getCurrentBoard() : null;

  const form = useForm<FormData>({
    resolver: zodResolver(
      mode === "edit" ? boardSchema.omit({ template: true }) : boardSchema,
    ),
    defaultValues: {
      title: currentBoard?.title ?? "",
      description: currentBoard?.description ?? "",
      template: "",
    },
  });

  const handleBoardActions = async (data: FormData) => {
    const { title, template, description } = data;

    if (mode === "edit" && currentBoard) {
      await delay(250);
      updateBoard(currentBoard.id, (board) => ({
        ...board,
        title,
        description,
      }));
      setIsModalOpen?.(false);
      return;
    }

    const encodedTitle = encodeURIComponent(
      title.replace(/\s+/g, "-").toLowerCase().trim(),
    );

    const selectedTemplate = columnsTemplates.find((t) => t.id === template);

    if (selectedTemplate) {
      const columns = selectedTemplate.columns.map((columnTitle) => ({
        id: generateUniqueID(),
        title: columnTitle,
        tasks: [],
      }));

      addBoardToStore(addBoard, {
        id: generateUniqueID(),
        title,
        description,
        columns,
      });

      router.prefetch(`/boards/${encodedTitle}`);
      await delay(isMobile ? 800 : 500);
      setIsModalOpen?.(false);
      router.push(`/boards/${encodedTitle}`);
      await delay(isMobile ? 400 : 250);
      toast.success(getToastMessage());
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleBoardActions)}
        className="space-y-4"
      >
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
        {mode === "create" && (
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
                    <SelectTrigger>
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {columnsTemplates.map((template) => {
                        const Icon = template.icon;
                        return (
                          <SelectItem key={template.id} value={template.id}>
                            <div className="flex items-center gap-2">
                              <Icon className="size-4" />
                              <h2>{template.title}</h2>
                            </div>
                          </SelectItem>
                        );
                      })}
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
        )}

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
          <Button className="px-2" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader className="animate-spin" />}
            {mode === "create" ? "Create" : "Save"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default BoardForm;
