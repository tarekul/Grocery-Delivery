import "./cart-item.styles.css";

const CartItem = ({ cartItem, editCart }) => {
  return (
    <div className="cart-item">
      <div className="cart-item-details">
        <h4 className="cart-item-name">{cartItem.name}</h4>
        <p className="cart-item-price">${cartItem.price}</p>
      </div>
      <div className="cart-item-quantity">
        <button
          className="cart-item-quantity-button red"
          onClick={() => editCart(cartItem.id, "cart", "remove")}
        >
          -
        </button>
        <span>{cartItem.quantity}</span>
        <button
          className="cart-item-quantity-button green"
          onClick={() => editCart(cartItem.id, "cart")}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default CartItem;
