import { useState, useEffect } from "react";
import CartItem from "../cart-item/cart-item";
import "./cart.styles.css";

const Cart = ({ cart, addToCart, removeFromCart }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        if (!isDropdownOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        setIsDropdownOpen(!isDropdownOpen);
    };

    useEffect(() => {
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div className="cart-container">
            {/* Cart Icon/Button */}
            <button className="cart-button" onClick={toggleDropdown}>
                Cart ({cart.length})
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <div className="cart-dropdown {cart.length > 0 ? has-items : ''}">
                    <h2>Your Cart</h2>
                    <button className="close-button" onClick={toggleDropdown}>X</button>
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
