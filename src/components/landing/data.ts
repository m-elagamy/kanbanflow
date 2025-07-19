import {
  CheckCircle,
  Database,
  Gauge,
  GripVertical,
  Lock,
  Palette,
  Settings,
} from "lucide-react";

const features = [
  {
    icon: GripVertical,
    title: "Effortless Drag & Drop",
    description:
      "Easily organize and prioritize tasks with smooth, intuitive drag-and-drop interactions.",
  },
  {
    icon: Database,
    title: "Real-Time Collaboration",
    description:
      "Your tasks are safely stored and quickly retrievable for a smooth workflow.",
  },
  {
    icon: Gauge,
    title: "Blazing Fast & Reliable",
    description:
      "Experience lightning-fast speed and dependable performance for uninterrupted workflows.",
  },
  {
    icon: Palette,
    title: "Modern UI",
    description:
      "Navigate an elegant, user-friendly interface designed for maximum efficiency.",
  },
  {
    icon: Lock,
    title: "Security",
    description:
      "Keep your data safe with robust protection and secure access for all users.",
  },
  {
    icon: Settings,
    title: "Customizable Workflows",
    description:
      "Adapt the board to your unique workflow with customizable columns and labels.",
  },
];

const steps = [
  {
    number: "01",
    title: "Create Your Board",
    description:
      "Set up your first Kanban board in seconds. Choose from our templates or start from scratch.",
    icon: CheckCircle,
  },
  {
    number: "02",
    title: "Add Your Tasks",
    description:
      "Create tasks with descriptions, priorities, and assignees. Organize them into columns.",
    icon: CheckCircle,
  },
  {
    number: "03",
    title: "Drag & Drop",
    description:
      "Move tasks between columns as they progress. Visualize your workflow in real-time.",
    icon: CheckCircle,
  },
];

export { features, steps };
