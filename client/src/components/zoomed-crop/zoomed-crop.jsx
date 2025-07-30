import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import "./zommed-crop.styles.css";

const ZoomedCrop = ({
  imageSrc,
  selectedItem,
  imageWidth,
  imageHeight,
  handleAddToCart,
  cartMap,
}) => {
  const [loaded, setLoaded] = useState(false);
  const cropSize = 400;
  const scale = (cropSize / imageWidth) * 3;
  if (!selectedItem.box) return null;
  const box = selectedItem.box;
  const itemId = selectedItem.id;
  const price = selectedItem.price;

  const style = {
    width: cropSize,
    height: cropSize,
    overflow: "hidden",
    position: "relative",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
  };
  const left = -box.x * scale + cropSize / 2 - (box.w * scale) / 2;
  const top = -box.y * scale + cropSize / 2 - (box.h * scale) / 2;

  const imageStyle = {
    position: "absolute",
    left: left > 0 ? 0 : left,
    top: top > 0 ? 0 : top,
    transform: `scale(${scale})`,
    transformOrigin: "top left",
    width: `${imageWidth}px`,
    height: `${imageHeight}px`,
    opacity: loaded ? 1 : 0,
    transition: "opacity 0.2s ease-in-out",
  };

  return (
    <div style={style}>
      <img
        src={imageSrc}
        alt="Zoomed Item"
        style={imageStyle}
        onLoad={() => setLoaded(true)}
      />
      {loaded && (
        <div
          className="modal-hotspot"
          style={{
            left: box.x * scale + (left > 0 ? 0 : left),
            top: box.y * scale + (top > 0 ? 0 : top),
            width: box.w * scale,
            height: box.h * scale,
          }}
        >
          <button
            className="add-to-cart-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(itemId);
            }}
          >
            <ShoppingBag size="1em" title="Add to Cart" color="green" />
            {cartMap[itemId] && (
              <span className="item-badge">{cartMap[itemId]}</span>
            )}
          </button>
          <p className="zoomed-price">{price}</p>
        </div>
      )}
    </div>
  );
};

export default ZoomedCrop;
