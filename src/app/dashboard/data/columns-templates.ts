import { Bug, Layers, Sliders, UserRoundCheck } from "lucide-react";

const columnsTemplates = [
  {
    id: "personal",
    label: "Personal Productivity",
    icon: UserRoundCheck,
    status: ["To Do", "In Progress", "Done"],
  },
  {
    id: "agile",
    label: "Agile Development",
    icon: Layers,
    status: ["Backlog", "In Progress", "Under Review", "Done"],
  },
  {
    id: "bug-tracking",
    label: "Bug Tracking",
    icon: Bug,
    status: ["Reported", "Testing", "Under Review", "Done"],
  },
  {
    id: "custom",
    label: "Custom Workflow",
    icon: Sliders,
    status: [],
  },
];

export default columnsTemplates;
