import { ShoppingBag, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import "./shelf-view.styles.css";

const ShelfView = ({ editCart, cart, image, items }) => {
  const [transform, setTransform] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const modalOverlayRef = useRef(null);
  const shelfImageRef = useRef(null);

  const cartMap = useMemo(() => {
    const map = {};
    cart.forEach((item) => {
      map[item.id] = item.quantity;
    });
    return map;
  }, [cart]);

  useEffect(() => {
    if (selectedItem && modalOverlayRef.current && shelfImageRef.current) {
      handleZoomIn(selectedItem);
    }
  }, [selectedItem]);

  const handleZoomIn = (item) => {
    if (!modalOverlayRef.current || !shelfImageRef.current) return;

    const scale = 2.5;

    const container = modalOverlayRef.current;
    const image = shelfImageRef.current;

    const itemLeft = parseFloat(item.shelf.position.left);
    const itemTop = parseFloat(item.shelf.position.top);

    const itemX = (image.offsetWidth * itemLeft) / 100;
    const itemY = (image.offsetHeight * itemTop) / 100;

    const centerX = container.offsetWidth / 2;
    const centerY = container.offsetHeight / 2;

    const translateX = centerX - itemX * scale;
    const translateY = centerY - itemY * scale;

    setTransform(
      `scale(${scale}) translate(${translateX / scale}px, ${
        translateY / scale
      }px)`
    );
  };

  const handleAddToCart = (item) => {
    editCart(item.id, "card", "add");
  };

  return (
    <>
      <div
        className={`shelf-container ${selectedItem ? "dimmed" : ""}`}
        onClick={() => setSelectedItem(null)}
      >
        <img src={image} alt="Grocery Shelf" className="shelf-image" />
        {items.map((item) => (
          <div
            key={item.id}
            className="hotspot"
            style={{
              left: item.shelf.position.left,
              top: item.shelf.position.top,
              width: item.shelf.width,
              height: item.shelf.height,
            }}
            title={`Add ${item.name}`}
            onClick={(e) => {
              if (!selectedItem) {
                e.stopPropagation();
                setSelectedItem(item);
              }
            }}
          ></div>
        ))}
      </div>
      {selectedItem && (
        <div className="modal-overlay" ref={modalOverlayRef}>
          <div
            className="zoom-wrapper"
            style={{
              transform: transform,
              transformOrigin: "top left",
              transition: "transform 0.7s ease",
              position: "relative",
            }}
          >
            <img src={image} alt={selectedItem.imageId} ref={shelfImageRef} />
            <div
              className="hotspot"
              style={{
                left: selectedItem.shelf.position.left,
                top: selectedItem.shelf.position.top,
                width: selectedItem.shelf.width,
                height: selectedItem.shelf.height,
              }}
            >
              <button
                className="add-to-cart-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(selectedItem);
                }}
              >
                <ShoppingBag size="1em" title="Add to Cart" color="green" />
                {cartMap[selectedItem.id] && (
                  <span className="item-badge">{cartMap[selectedItem.id]}</span>
                )}
              </button>
            </div>
          </div>
          <button
            className="close-modal-btn"
            onClick={() => setSelectedItem(null)}
          >
            <X size="1em" title="Close" color="var(--primary)" />
          </button>
        </div>
      )}
    </>
  );
};

export default ShelfView;
