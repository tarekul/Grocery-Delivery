import { Minus, Plus } from "lucide-react";
import "./search-item.styles.css";

const SearchItem = ({ item, editCart, cart }) => {
  const inCart = cart.find((cartItem) => cartItem.id === item.id);

  return (
    <div className={`search-item`}>
      <div className="search-item-details">
        <h4 className="search-item-name">{item.name}</h4>
        <p className="search-item-price">${item.price}</p>
      </div>

      <div className="search-item-actions">
        {/* Add button with badge */}
        <button
          className="search-button green"
          onClick={() => editCart(item.id, "cart")}
        >
          <Plus size={18} />
          {inCart && inCart.quantity > 1 && (
            <span className="search-quantity-badge">{inCart.quantity}</span>
          )}
        </button>

        {/* Show remove button only if item is in cart */}
        {inCart && (
          <button
            className="search-button red"
            onClick={() => editCart(item.id, "cart", "remove")}
          >
            <Minus size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchItem;
