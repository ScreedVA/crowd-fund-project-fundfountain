import { useEffect } from "react";
import "./Toaster.css";
interface toastProps {
  message: string;
  type: string;
  onClose: () => void;
}

const Toaster: React.FC<toastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    setTimeout(onClose, 3500);
  }, [onClose]);

  return (
    <>
      <div
        className="toast-container"
        style={
          type === "success"
            ? { backgroundColor: "#4CAF50" }
            : { backgroundColor: "#f44336" }
        }
      >
        <div>{message}</div>
      </div>
    </>
  );
};
export default Toaster;
