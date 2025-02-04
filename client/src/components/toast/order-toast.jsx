import React, { useEffect } from "react";
import "./toast.styles.css";

const OrderToast = ({ onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 8000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return <div className="toast submit">Order placed successfully!</div>;
};

export default OrderToast;
