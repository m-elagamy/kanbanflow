import { AlertCircle } from "lucide-react";

function ErrorMessage({
  id,
  children,
  className,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      id={id}
      className={`flex items-center gap-1 text-[0.8rem] text-destructive ${className}`}
    >
      <AlertCircle size={13} />
      {children}
    </p>
  );
}

export default ErrorMessage;
