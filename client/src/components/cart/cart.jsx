import { useEffect, useState } from "react";
import { useCart } from "../../contexts/cartContext";
import { useUI } from "../../contexts/UIContext";
import { saveCartToLocalStorage } from "../../functions/saveCart";
import CartButton from "../cart-button/cart-button";
import CartItem from "../cart-item/cart-item";
import "./cart.styles.css";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [isClosing, setIsClosing] = useState(false);

  const navigate = useNavigate();

  const { cart, setCart, cartEditor } = useCart();
  const {
    isCartOpen,
    setIsCartOpen,
    isSearchBarActive,
  } = useUI();

  const totalPrice = cart.reduce(
    (totalPrice, cartItem) => totalPrice + cartItem.quantity * cartItem.price,
    0
  );

  const hasItems = cart.length > 0 ? "has-items" : "";

  const toggleCart = () => {
    if (isCartOpen) {
      setIsClosing(true);
      if (window.innerWidth <= 768) {
        document.body.style.overflow = "unset";
      }

      setTimeout(() => {
        setIsClosing(false);
        setIsCartOpen(false);
      }, 500);
    } else {
      setIsCartOpen(true);
      if (window.innerWidth <= 768) {
        document.body.style.overflow = "hidden";
      }
    }
  };

  const toggleCheckout = () => {
    navigate("/checkout");
    setIsCartOpen(false);
    if (window.innerWidth <= 768) {
      document.body.style.overflow = "unset";
    }
  };

  const clearCart = () => {
    setCart([]);
    saveCartToLocalStorage([]);
  };

  useEffect(() => {
    return () => {
      if (window.innerWidth <= 768) {
        document.body.style.overflow = "unset";
      }
    };
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      const badge = document.querySelector(".cart-badge");
      badge.style.animation = "none";

      // Force a reflow to trigger the animation
      void badge.offsetWidth;
      badge.style.animation = "badgeBounce 0.3s ease-in-out";
    }
  }, [cart.length]);

  return (
    <div className="cart-container">
      <CartButton
        cart={cart}
        toggleDropdown={toggleCart}
        isSearchBarActive={isSearchBarActive}
      />

      {isCartOpen && (
        <div
          className={`cart-dropdown ${isClosing ? "closing" : ""} ${hasItems}`}
        >
          <h2>Your Cart</h2>
          <button className="close-button" onClick={toggleCart}>
            X
          </button>
          <p className="total-price">Total: ${totalPrice.toFixed(2)}</p>
          {cart.length > 0 && (
            <button className="clear-button" onClick={clearCart}>
              Clear
            </button>
          )}
          {cart.length > 0 ? (
            <div className="cart-items">
              {cart.map((cartItem) => (
                <CartItem
                  key={cartItem.id}
                  cartItem={cartItem}
                  editCart={cartEditor}
                />
              ))}
              <button className="checkout-button" onClick={toggleCheckout}>
                Checkout
              </button>
            </div>
          ) : (
            <p>Your cart is empty</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;
