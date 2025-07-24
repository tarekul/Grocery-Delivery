import { ShoppingBag } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import "./shelf-view.styles.css";

const ShelfView = ({ editCart, cart, image, items }) => {
  const [transform, setTransform] = useState("");
  const [scale, setScale] = useState(1);
  const shelfContainerRef = useRef(null);
  const shelfImageRef = useRef(null);

  const cartMap = useMemo(() => {
    const map = {};
    cart.forEach((item) => {
      map[item.id] = item.quantity;
    });
    return map;
  }, [cart]);

  const handleZoomIn = (item) => {
    if (!shelfContainerRef.current || !shelfImageRef.current) return;

    if (scale > 1) {
      handleZoomOut();
      return;
    }

    const newScale = scale + 1.5;

    const container = shelfContainerRef.current;
    const image = shelfImageRef.current;

    const itemLeft = parseFloat(item.shelf.position.left);
    const itemTop = parseFloat(item.shelf.position.top);
    const itemWidth = parseFloat(item.shelf.width);
    const itemHeight = parseFloat(item.shelf.height);

    // Convert percentages to pixels, and add half the width/height to get center
    const itemX = (image.offsetWidth * (itemLeft + itemWidth)) / 100;
    const itemY = (image.offsetHeight * (itemTop + itemHeight)) / 100;

    const centerX = container.offsetWidth / 2;
    const centerY = container.offsetHeight / 2;

    const translateX = centerX - itemX * newScale;
    const translateY = centerY - itemY * newScale;

    setTransform(
      `scale(${newScale}) translate(${translateX / newScale}px, ${
        translateY / newScale
      }px)`
    );
    setScale(newScale);
  };

  const handleZoomOut = () => {
    setTransform("");
    setScale(1);
  };

  const handleAddToCart = (item) => {
    editCart(item.id, "card", "add");
  };

  return (
    <div className="shelf-container" ref={shelfContainerRef}>
      <div
        className="zoom-wrapper"
        style={{
          transform: transform,
          transformOrigin: "top left",
          transition: "transform 0.7s ease",
          position: "relative",
        }}
      >
        <img
          src={image}
          alt="Grocery Shelf"
          className="shelf-image"
          ref={shelfImageRef}
        />
        {items.map((item) => (
          <div
            key={item.id}
            className={`hotspot ${scale > 1 ? "full-zoomed" : ""}`}
            style={{
              left: item.shelf.position.left,
              top: item.shelf.position.top,
              width: item.shelf.width,
              height: item.shelf.height,
            }}
            title={`Add ${item.name}`}
            onClick={(e) => {
              e.stopPropagation();
              handleZoomIn(item);
            }}
          >
            <button
              className="add-to-cart-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(item);
              }}
            >
              <ShoppingBag size="1em" title="Add to Cart" color="green" />
              {cartMap[item.id] && (
                <span className="item-badge">{cartMap[item.id]}</span>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShelfView;
