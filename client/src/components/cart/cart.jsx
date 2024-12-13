import { useState } from "react";
import CartItem from "../cart-item/cart-item";
import "./cart.styles.css";

const Cart = ({ cart, addToCart, removeFromCart }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="cart-container">
            {/* Cart Icon/Button */}
            <button className="cart-button" onClick={toggleDropdown}>
                Cart ({cart.length})
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <div className="cart-dropdown">
                    <h2>Your Cart</h2>
                    {cart.length > 0 ? (
                        <div className="cart-items">
                            {cart.map((cartItem) => (
                                <CartItem 
                                    key={cartItem.item.id}
                                    cartItem={cartItem}
                                    addToCart={addToCart}
                                    removeFromCart={removeFromCart}
                                />
                            ))}
                            <button className="checkout-button">Checkout</button>
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
