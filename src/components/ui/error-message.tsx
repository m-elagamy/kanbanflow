import { AlertCircle } from "lucide-react";

function ErrorMessage({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <p
      id={id}
      className="flex items-center gap-1 text-[0.8rem] text-destructive"
    >
      <AlertCircle size={13} />
      {children}
    </p>
  );
}
export default ErrorMessage;
