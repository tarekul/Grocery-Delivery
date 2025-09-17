import React from "react";
import "./skeleton-order-card.styles.css";

const SkeletonOrderCard = () => {
  return (
    <div className="skeleton-card">
      <div>
        <div className="skeleton-line" style={{ width: "50%" }}></div>
        <div className="skeleton-line" style={{ width: "40%" }}></div>
        <div className="skeleton-line" style={{ width: "20%" }}></div>
        <div className="skeleton-line" style={{ width: "22%" }}></div>
        <div className="skeleton-line" style={{ width: "25%" }}></div>
        <div className="skeleton-line" style={{ width: "25%" }}></div>
        <div className="skeleton-line" style={{ width: "25%" }}></div>
      </div>
    </div>
  );
};

export default SkeletonOrderCard;
