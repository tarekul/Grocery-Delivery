import React, { useRef, useState } from "react";
import "./shelf-view.styles.css";
import shelfImage from "./shelf.jpg";

const ShelfView = () => {
  const [zoom, setZoom] = useState(false);
  const [transform, setTransform] = useState(""); // store transform CSS
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  const items = [
    {
      id: 1,
      name: "Milk",
      price: "$3.99",
      position: { left: "20%", top: "30%" },
      width: "10%",
      height: "15%",
    },
    {
      id: 2,
      name: "Dahi",
      price: "$4.49",
      position: { left: "62%", top: "37%" },
      width: "10%",
      height: "15%",
    },
  ];

  const handleZoomOut = () => {
    setZoom(false);
    setTransform("");
  };

  const handleZoomIn = (item) => {
    if (!containerRef.current || !imageRef.current) return;

    const container = containerRef.current;
    const image = imageRef.current;

    // Calculate actual pixel position of the hotspot
    const itemLeftPercent = parseFloat(item.position.left) / 100;
    const itemTopPercent = parseFloat(item.position.top) / 100;

    const itemX = image.offsetWidth * itemLeftPercent;
    const itemY = image.offsetHeight * itemTopPercent;

    // Center of the viewport
    const centerX = container.offsetWidth / 2;
    const centerY = container.offsetHeight / 2;

    // Translate such that the clicked item moves to the center
    const scale = 2; // or any zoom level
    const translateX = centerX - itemX * scale;
    const translateY = centerY - itemY * scale;

    setTransform(
      `scale(${scale}) translate(${translateX / scale}px, ${
        translateY / scale
      }px)`
    );
    setZoom(true);
  };

  return (
    <div className="shelf-container" ref={containerRef}>
      <div
        className={`zoomed-image ${zoom ? "zoomed" : ""}`}
        onClick={handleZoomOut}
        style={{ position: "relative" }}
      >
        <div
          className="zoom-wrapper"
          style={{
            transform: transform,
            transformOrigin: "top left",
            transition: "transform 0.3s ease",
            position: "relative",
          }}
        >
          <img
            ref={imageRef}
            src={shelfImage}
            alt="Grocery Shelf"
            className="shelf-image"
          />
          {items.map((item) => (
            <div
              key={item.id}
              className="hotspot"
              style={{
                left: item.position.left,
                top: item.position.top,
                width: item.width,
                height: item.height,
              }}
              title={`Add ${item.name}`}
              onClick={(e) => {
                e.stopPropagation(); // prevent zoom-out
                handleZoomIn(item);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShelfView;
