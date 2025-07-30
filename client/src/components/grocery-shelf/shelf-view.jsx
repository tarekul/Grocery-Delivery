import { useEffect, useMemo, useRef, useState } from "react";
import LoadingIcon from "../loading-icon/loading-icon";
import ZoomedCrop from "../zoomed-crop/zoomed-crop";
import "./shelf-view.styles.css";

const ShelfView = ({ editCart, cart, image, items }) => {
  const [loaded, setLoaded] = useState(false);
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

  const getItemBox = (item) => {
    if (!shelfImageRef.current) return null;

    const image = shelfImageRef.current;
    const { width, height } = item.shelf;
    const { left, top } = item.shelf.position;
    const imageWidth = image.offsetWidth;
    const imageHeight = image.offsetHeight;

    const x = (parseFloat(left) / 100) * imageWidth;
    const y = (parseFloat(top) / 100) * imageHeight;
    const w = (parseFloat(width) / 100) * imageWidth;
    const h = (parseFloat(height) / 100) * imageHeight;

    return { x, y, w, h };
  };

  const handleAddToCart = (itemId) => {
    editCart(itemId, "card", "add");
  };

  useEffect(() => {
    document.body.style.overflow = selectedItem ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedItem]);

  return (
    <>
      <div className={`shelf-container ${selectedItem ? "dimmed" : ""}`}>
        <img
          src={image}
          alt="Grocery Shelf"
          className="shelf-image"
          style={{
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.2s ease-in-out",
          }}
          ref={shelfImageRef}
          onLoad={() => setLoaded(true)}
        />
        {!loaded && <LoadingIcon />}
        {loaded &&
          items.map((item) => (
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
                  const box = getItemBox(item);
                  setSelectedItem({ ...item, box });
                }
              }}
            ></div>
          ))}
      </div>
      {selectedItem && (
        <div
          className="modal-overlay"
          ref={modalOverlayRef}
          onClick={() => {
            setSelectedItem(null);
          }}
        >
          <ZoomedCrop
            imageSrc={image}
            selectedItem={selectedItem}
            imageWidth={shelfImageRef.current.offsetWidth}
            imageHeight={shelfImageRef.current.offsetHeight}
            handleAddToCart={handleAddToCart}
            cartMap={cartMap}
          />
        </div>
      )}
    </>
  );
};

export default ShelfView;
