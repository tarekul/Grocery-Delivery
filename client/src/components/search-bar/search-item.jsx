import { useState } from "react";
import "./search-item.styles.css";

const SearchItem = ({ item, editCart, cart }) => {
  const enableButton = cart.find((cartItem) => cartItem.id === item.id);
  const [isFullSizeVisible, setFullSizeVisible] = useState(false);

  const handleImageClick = () => {
    setFullSizeVisible(true);
  };

  const handleOverlayClick = () => {
    setFullSizeVisible(false);
  };
  return (
    <div className="search-item">
      <div className="search-item-details">
        <h4 className="search-item-name">{item.name}</h4>
        <p className="search-item-price">${item.price}</p>
        <div className="search-item-quantity">
          <button
            className={`search-item-quantity-button red ${
              !enableButton ? "disabled" : ""
            }`}
            onClick={() => editCart(item.id, "cart", "remove")}
            disabled={!enableButton}
          >
            -
          </button>
          <button
            className="search-item-quantity-button green"
            onClick={() => editCart(item.id, "cart")}
          >
            +
          </button>
        </div>

        {isFullSizeVisible && (
          <div className="search-item-overlay" onClick={handleOverlayClick}>
            <img src={item.image} alt={item.name} className="full-size-image" />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchItem;
