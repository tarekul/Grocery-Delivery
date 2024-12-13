import { useState } from "react";
import CartItem from "../card-item/card-item";

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
                            {cart.map((item) => (
                                <CartItem
                                    item={item}
                                    addToCart={addToCart}
                                    removeFromCart={removeFromCart}
                                />
                            ))}
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
