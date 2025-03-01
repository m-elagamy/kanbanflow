import { toast } from "sonner";

const handleOnError = (error: unknown, message: string | React.ReactNode) => {
  console.error("Error:", error);
  toast.error(message, {
    description:
      "An error occurred while processing your request. Please try again.",
    duration: 5000,
    icon: "🚨",
  });
};

export default handleOnError;
