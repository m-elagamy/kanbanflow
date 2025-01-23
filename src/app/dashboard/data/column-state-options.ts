import {
  RefreshCw,
  List,
  PlayCircle,
  Ban,
  ClipboardCheck,
  Eye,
  CheckCircle,
  Rocket,
  PauseCircle,
  Archive,
  CircleX,
  ThumbsUp,
} from "lucide-react";

const stateOptions = {
  "In Progress": { icon: RefreshCw, color: "#F5A623" },
  "To Do": { icon: List, color: "#4A90E2" },
  "Ready for Development": { icon: PlayCircle, color: "#673AB7" },
  Blocked: { icon: Ban, color: "#F44336" },
  Testing: { icon: ClipboardCheck, color: "#FFC107" },
  "Under Review": { icon: Eye, color: "#00BCD4" },
  Done: { icon: CheckCircle, color: "#7ED321" },
  Deployed: { icon: Rocket, color: "#3F51B5" },
  "On Hold": { icon: PauseCircle, color: "#9B9B9B" },
  Backlog: { icon: Archive, color: "#9E9E9E" },
  Cancelled: { icon: CircleX, color: "#D32F2F" },
  "Ready for Review": { icon: ThumbsUp, color: "#8BC34A" },
};

export default stateOptions;
