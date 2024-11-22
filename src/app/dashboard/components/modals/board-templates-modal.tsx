import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CheckCircle2Icon,
  LayoutTemplateIcon,
  ListTodoIcon,
  PlusIcon,
  WorkflowIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Onboarding Templates
const onboardingTemplates = [
  {
    id: "personal",
    title: "Personal Productivity",
    icon: ListTodoIcon,
    columns: ["To Do", "In Progress", "Completed"],
    description: "Track personal tasks and goals",
  },
  {
    id: "agile",
    title: "Agile Development",
    icon: WorkflowIcon,
    columns: ["Backlog", "To Do", "In Progress", "Review", "Done"],
    description: "Manage software development workflow",
  },
  {
    id: "custom",
    title: "Custom Workflow",
    icon: LayoutTemplateIcon,
    columns: [],
    description: "Create your own unique workflow",
  },
];

const BoardTemplatesDialog = ({
  isTemplateDialogOpen,
  setIsTemplateDialogOpen,
  selectedTemplate,
  setSelectedTemplate,
  boardName,
  setIsBoardCreationDialogOpen,
}: {
  isTemplateDialogOpen: boolean;
  setIsTemplateDialogOpen: (isOpen: boolean) => void;
  selectedTemplate: string | null;
  setSelectedTemplate: (templateId: string | null) => void;
  boardName: string;
  setIsBoardCreationDialogOpen: (isOpen: boolean) => void;
}) => {
  const router = useRouter();

  return (
    <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto rounded-xl p-4 md:p-6">
        <DialogHeader>
          <DialogTitle>Setup Your Board Workflow</DialogTitle>
          <DialogDescription>
            Pick a ready-made template to get started quickly and stay
            productive.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {onboardingTemplates.map((template) => (
              <Card
                key={template.id}
                className={`cursor-pointer transition-all hover:border-primary ${selectedTemplate === template.id ? "border-primary ring-2 ring-primary/50" : ""} `}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <CardContent className="space-y-2 p-3 pt-4">
                  <div className="flex items-center justify-between">
                    <template.icon className="text-primary" />
                    {selectedTemplate === template.id && (
                      <CheckCircle2Icon className="text-primary" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{template.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {template.description}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Columns: {template.columns.length || "Flexible"}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              disabled={!selectedTemplate}
              aria-disabled={!selectedTemplate}
              onClick={() => {
                // TODO: Implement board creation with selected template
                setIsBoardCreationDialogOpen(false);
                setIsTemplateDialogOpen(false);
                router.push(`/dashboard/${boardName}`);
              }}
            >
              Create Board
              <PlusIcon />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BoardTemplatesDialog;
