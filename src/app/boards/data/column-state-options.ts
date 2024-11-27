import {
  CheckCircle,
  ClipboardCheck,
  Eye,
  List,
  PauseCircle,
  RefreshCw,
  PlayCircle,
  Archive,
  CircleX,
  Ban,
} from "lucide-react";

const stateOptions = {
  Backlog: { icon: Archive, color: "#9E9E9E" },
  "To Do": { icon: List, color: "#4A90E2" },
  "Ready for Development": { icon: PlayCircle, color: "#673AB7" },
  "In Progress": { icon: RefreshCw, color: "#F5A623" },
  Blocked: { icon: Ban, color: "#F44336" },
  "On Hold": { icon: PauseCircle, color: "#9B9B9B" },
  Testing: { icon: ClipboardCheck, color: "#FFC107" },
  "Under Review": { icon: Eye, color: "#00BCD4" },
  Done: { icon: CheckCircle, color: "#7ED321" },
  Cancelled: { icon: CircleX, color: "#D32F2F" },
};

export default stateOptions;
