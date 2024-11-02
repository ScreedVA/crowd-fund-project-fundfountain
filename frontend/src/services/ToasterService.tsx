import { useState } from "react";

const useToast = () => {
  const [toast, setToast] = useState({
    message: "",
    type: "",
    isVisible: false,
  });

  function showToast(message: string, type: string = "success") {
    setToast({ message, type, isVisible: true });
  }

  function hideToast() {
    setToast((prevToast) => ({ ...prevToast, isVisible: false }));
  }

  return { toast, showToast, hideToast };
};

export default useToast;
