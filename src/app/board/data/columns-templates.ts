import { Bug, Layers, Sliders, UserRoundCheck } from "lucide-react";

const columnsTemplates = [
  {
    id: "personal",
    title: "Personal Productivity",
    icon: UserRoundCheck,

    columns: ["To Do", "In Progress", "Done"],
  },
  {
    id: "agile",
    title: "Agile Development",
    icon: Layers,
    columns: ["In Progress", "Under Review", "Ready for Development"],
  },
  {
    id: "bug-tracking",
    title: "Bug Tracking",
    icon: Bug,
    columns: ["Testing", "Under Review", "Done"],
  },
  {
    id: "custom",
    title: "Custom Workflow",
    icon: Sliders,
    columns: [],
  },
];

export default columnsTemplates;
