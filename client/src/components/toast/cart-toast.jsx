import React, { useEffect } from "react";
import { useUI } from "../../contexts/UIContext";
import "./toast.styles.css";

const CartToast = () => {
  const { toastMessage, toastColor, showToast, setShowToast } = useUI();

  useEffect(() => {
    if (!showToast) return;

    const timer = setTimeout(() => {
      setShowToast(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showToast, setShowToast]);

  if (!showToast) return null;

  return (
    <div className={`toast ${toastColor === "green" ? "success" : "error"}`}>
      {toastMessage}
    </div>
  );
};

export default CartToast;
