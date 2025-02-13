import { SelectItem } from "@/components/ui/select";

type StatusOptionProps = {
  status: string;
  Icon: React.ElementType;
  color: string;
};

const StatusOptions = ({ status, Icon, color }: StatusOptionProps) => (
  <SelectItem value={status}>
    <div className="flex items-center space-x-2">
      <Icon size={16} color={color} />
      <span>{status}</span>
    </div>
  </SelectItem>
);

export default StatusOptions;
