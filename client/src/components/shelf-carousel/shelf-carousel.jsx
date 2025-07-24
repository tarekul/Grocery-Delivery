import shelfImageMap from "../../shelfImageMap";
import ShelfView from "../grocery-shelf/shelf-view.jsx";
import "./shelf-carousel.styles.css";

const ShelfCarousel = ({ editCart, cart, inventory }) => {
  const allItems = Object.values(inventory).flatMap((shelf) =>
    Object.values(shelf)
  );

  const isSingleShelf = Object.keys(shelfImageMap).length === 1;

  return (
    <div className="shelf-carousel">
      {Object.entries(shelfImageMap).map(([imageId, imageUrl]) => {
        const itemsForShelf = allItems.filter(
          (item) => item.shelf.imageId === imageId
        );
        return (
          <div
            className={`shelf-item ${isSingleShelf ? "full-width" : ""}`}
            key={imageId}
          >
            <ShelfView
              editCart={editCart}
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
