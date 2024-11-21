"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import BoardTemplatesDialog from "./board-templates-modal";
import boardSchema from "@/schemas/board-schema";

const BoardCreationDialog = () => {
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isBoardCreationDialogOpen, setIsBoardCreationDialogOpen] =
    useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [boardName, setBoardName] = useState("");

  const form = useForm({
    resolver: zodResolver(boardSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = (data: z.infer<typeof boardSchema>) => {
    setBoardName(data.title);
    setIsTemplateDialogOpen(true);
  };

  return (
    <>
      <Dialog
        open={isBoardCreationDialogOpen}
        onOpenChange={setIsBoardCreationDialogOpen}
      >
        <DialogTrigger asChild>
          <Button className="group">
            <PlusCircle className="transition-transform group-hover:rotate-90" />
            Create
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Board</DialogTitle>
            <DialogDescription>
              Give your board a name and optional description
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Board Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Personal Tasks" {...field} />
                    </FormControl>
                    <FormDescription>
                      Choose a clear and descriptive name for your board
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Organize my daily and work tasks"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Add context to help you remember the board&apos;s purpose
                    </FormDescription>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Confirm</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      {isTemplateDialogOpen && (
        <BoardTemplatesDialog
          isTemplateDialogOpen={isTemplateDialogOpen}
          setIsTemplateDialogOpen={setIsTemplateDialogOpen}
          setIsBoardCreationDialogOpen={setIsBoardCreationDialogOpen}
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
          boardName={boardName}
        />
      )}
    </>
  );
};

export default BoardCreationDialog;
