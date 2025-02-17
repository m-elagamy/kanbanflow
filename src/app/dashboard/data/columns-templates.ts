import { Bug, Layers, Sliders, UserRoundCheck } from "lucide-react";

const columnsTemplates = [
  {
    id: "personal",
    title: "Personal Productivity",
    icon: UserRoundCheck,
    status: ["To Do", "In Progress", "Done"],
  },
  {
    id: "agile",
    title: "Agile Development",
    icon: Layers,
    status: ["In Progress", "Under Review", "Ready for Development"],
  },
  {
    id: "bug-tracking",
    title: "Bug Tracking",
    icon: Bug,
    status: ["Testing", "Under Review", "Done"],
  },
  {
    id: "custom",
    title: "Custom Workflow",
    icon: Sliders,
    status: [],
  },
];

export default columnsTemplates;
