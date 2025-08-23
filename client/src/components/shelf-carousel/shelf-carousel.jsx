import { useCart } from "../../contexts/cartContext";
import { useUI } from "../../contexts/UIContext";
import shelfImageMap from "../../shelfImageMap";
import ShelfView from "../grocery-shelf/shelf-view.jsx";
import "./shelf-carousel.styles.css";

const ShelfCarousel = ({ category }) => {
  const { cart, cartEditor } = useCart();
  const { inventory } = useUI();

  const allItems = Object.values(inventory[category]);

  const isSingleShelf = Object.keys(shelfImageMap).length === 1;

  return (
    <div className="shelf-carousel">
      {Object.entries(shelfImageMap).map(([imageId, imageUrl]) => {
        const itemsForShelf = allItems.filter((item) => {
          return item.shelf?.imageId === imageId;
        });

        return (
          <div
            className={`shelf-item ${isSingleShelf ? "full-width" : ""}`}
            key={imageId}
          >
            <ShelfView
              editCart={cartEditor}
              cart={cart}
              image={imageUrl}
              items={itemsForShelf}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ShelfCarousel;
