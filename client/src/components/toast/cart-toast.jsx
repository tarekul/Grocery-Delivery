import React, { useEffect } from "react";
import "./toast.styles.css";

const CartToast = ({ message, onClose, color }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast ${color === "green" ? "success" : "error"}`}>
      {message}
    </div>
  );
};

export default CartToast;
