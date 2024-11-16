import { useState } from "react";
import { ToasterMessageType } from "../models/ToasterModel";

const useToast = () => {
  const [toast, setToast] = useState({
    message: "",
    type: "",
    isVisible: false,
  });

  function showToast(message: string, type: ToasterMessageType = ToasterMessageType.SUCCESS) {
    setToast({ message, type, isVisible: true });
  }

  function hideToast() {
    setToast((prevToast) => ({ ...prevToast, isVisible: false }));
  }

  return { toast, showToast, hideToast };
};

export default useToast;
