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
    status: ["In Progress", "Under Review", "Ready for Development"],
  },
  {
    id: "bug-tracking",
    label: "Bug Tracking",
    icon: Bug,
    status: ["Testing", "Under Review", "Done"],
  },
  {
    id: "custom",
    label: "Custom Workflow",
    icon: Sliders,
    status: [],
  },
];

export default columnsTemplates;
