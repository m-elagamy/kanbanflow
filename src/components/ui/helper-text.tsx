import { InfoIcon } from "lucide-react";

const HelperText = ({
  children,
  error,
}: {
  children: React.ReactNode;
  error?: boolean;
}) => {
  return (
    <p
      className={`flex items-center gap-1 text-[0.8rem] text-muted-foreground transition-opacity ${
        error ? "opacity-50" : "opacity-100"
      }`}
    >
      <InfoIcon className="size-3 text-muted-foreground" />
      {children}
    </p>
  );
};

export default HelperText;
