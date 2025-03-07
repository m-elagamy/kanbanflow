import { toast } from "sonner";
import ProgressBar from "./progress-bar";

type InfoToastProps = {
  message: string;
  duration?: number;
  action?: { label: string; onClick: () => void };
};

const InfoToast = ({ message, duration = 5000, action }: InfoToastProps) => {
  toast.info(
    <div>
      {message}
      <ProgressBar variant="info" duration={duration} />
    </div>,
    {
      duration: duration,
      action: action,
      position: "top-center",
      closeButton: true,
    },
  );
};

export default InfoToast;
