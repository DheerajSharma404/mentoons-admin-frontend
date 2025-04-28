import { toast } from "sonner";

export const successToast = (message: string) => {
  toast.success(message, {
    position: "top-right",
    onAutoClose: () => {
      toast.dismiss();
    },
    style: {
      backgroundColor: "#4CAF50",
      color: "white",
      fontSize: "14px",
      padding: "10px",
    },
    icon: "✅",
  });
};
export const errorToast = (message: string) => {
  toast.error(message, {
    position: "top-right",
    onAutoClose: () => {
      toast.dismiss();
    },
    style: {
      fontSize: "14px",
      padding: "10px",
      backgroundColor: "#f44336",
      color: "white",
    },
    icon: "❌",
  });
};
