import React from "react";
import "./skeleton-order-card.styles.css";

const SkeletonOrderCard = () => {
  return (
    <div className="skeleton-card">
      <div>
        <div className="skeleton-line" style={{ width: "50%" }}></div>
        <div className="skeleton-line" style={{ width: "30%" }}></div>
      </div>
    </div>
  );
};

export default SkeletonOrderCard;
