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

const faqs = [
  {
    question: "Is KanbanFlow free to use?",
    answer:
      "Yes, KanbanFlow is completely free to use. You can create unlimited boards and tasks without any restrictions.",
  },
  {
    question: "Do I need to download anything?",
    answer:
      "No, KanbanFlow is a web-based application. Simply sign up and start using it directly in your browser - no downloads or installations required.",
  },
  {
    question: "Can I use KanbanFlow on mobile?",
    answer:
      "Yes! KanbanFlow is fully responsive and works seamlessly on mobile devices, tablets, and desktops. Access your boards from anywhere.",
  },
  {
    question: "How secure is my data?",
    answer:
      "Your data is protected with industry-standard security measures. We use secure authentication and your information is stored safely in our database.",
  },
  {
    question: "Can I collaborate with my team?",
    answer:
      "Currently, KanbanFlow is designed for personal use. Each user has their own boards and tasks. Team collaboration features may be added in future updates.",
  },
];

export { features, steps, faqs };